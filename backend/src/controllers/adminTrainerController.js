const {User} = require("../models/user");
const TrainerData = require("../models/Trainer");
const MemberData = require("../models/Member");
const mongoose = require("mongoose");

// GET ALL ACTIVE AND INACTIVE TRAINERS
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({
      role: "trainer",
      status: { $in: ["active", "inactive"] },
      isDeleted: { $ne: true },
    })
      .select("name email phone specialization experience status createdAt")
      .sort({ name: 1 })
      .lean();

    const trainerIds = trainers.map((trainer) => trainer._id);

    const trainerDataList = await TrainerData.find({
      trainerId: { $in: trainerIds },
    });

    const trainerDataMap = {};

    trainerDataList.forEach((data) => {
      trainerDataMap[data.trainerId.toString()] = data;
    });

    trainers.forEach((trainer) => {
      const data = trainerDataMap[trainer._id.toString()];

      if (data) {
        trainer.specialization = data.specialization || "";
        trainer.experience = data.experience || 0;
        trainer.bio = data.bio || "";
        trainer.memberLimit = data.memberLimit ?? 20;
      }
    });

    const trainersWithCount = await Promise.all(
      trainers.map(async (trainer) => {
        const assignedMemberCount = await MemberData.countDocuments({
          assignedTrainer: trainer._id,
        });

        return {
          ...trainer,
          assignedMemberCount,
          memberLimit: Number(trainer.memberLimit ?? 20),
          isFull: assignedMemberCount >= Number(trainer.memberLimit ?? 20),
        };
      })
    );

    return res.status(200).json({
      success: true,
      trainers: trainersWithCount,
    });
  } catch (error) {
    console.error("Get trainers error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ADD TRAINER
exports.addTrainer = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experience, status } =
      req.body;
    const requestedLimit = req.body.memberLimit === undefined ? 20 : Number(req.body.memberLimit);
    if (!Number.isInteger(requestedLimit) || requestedLimit < 1) {
      return res.status(400).json({ success: false, message: "Member limit must be a positive whole number" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingTrainer = await User.findOne({
      email: normalizedEmail,
    });

    if (existingTrainer) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const trainer = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone,
      status: status === "inactive" ? "inactive" : "active",
      role: "trainer",
    });

    await TrainerData.create({
      trainerId: trainer._id,
      specialization: specialization || "",
      experience: String(Number(experience) || 0),
      memberLimit: requestedLimit,
    });

    const trainerData = trainer.toObject();
    delete trainerData.password;

    return res.status(201).json({
      success: true,
      message: "Trainer added successfully",
      trainer: {
        ...trainerData,
        assignedMemberCount: 0,
        memberLimit: requestedLimit,
        isFull: false,
      },
    });
  } catch (error) {
    console.error("Add trainer error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE TRAINER
exports.updateTrainer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      experience,
      status,
      password,
      memberLimit,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID",
      });
    }

    const trainer = await User.findOne({
      _id: req.params.id,
      role: "trainer",
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: trainer._id },
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      trainer.email = normalizedEmail;
    }

    if (name !== undefined) trainer.name = name.trim();
    if (phone !== undefined) trainer.phone = phone;
    let validatedExperience;
    if (experience !== undefined) {
      const exp = Number(experience);

      if (!Number.isFinite(exp) || exp < 0) {
        return res.status(400).json({
          success: false,
          message: "Experience must be a valid non-negative number",
        });
      }

      validatedExperience = String(exp);
    }

    if (status !== undefined) {
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid trainer status",
        });
      }

      trainer.status = status;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      trainer.password = password;
    }
    let validatedMemberLimit;
    if (memberLimit !== undefined) {
      const limit = Number(memberLimit);

      if (!Number.isInteger(limit) || limit < 1) {
        return res.status(400).json({
          success: false,
          message: "Member limit must be a positive whole number",
        });
      }

      validatedMemberLimit = limit;
    }

    await trainer.save();

    if (specialization !== undefined || validatedExperience !== undefined || validatedMemberLimit !== undefined) {
      const update = {};
      if (specialization !== undefined) update.specialization = specialization;
      if (validatedExperience !== undefined)
        update.experience = validatedExperience;
      if (validatedMemberLimit !== undefined) update.memberLimit = validatedMemberLimit;
      await TrainerData.findOneAndUpdate(
        { trainerId: trainer._id },
        { $set: update, $setOnInsert: { trainerId: trainer._id } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
    }

    const trainerData = trainer.toObject();
    delete trainerData.password;

    const assignedMemberCount = await MemberData.countDocuments({
      assignedTrainer: trainer._id,
    });
    const savedTrainerData = await TrainerData.findOne({ trainerId: trainer._id }).lean();
    const savedMemberLimit = Number(savedTrainerData?.memberLimit ?? 20);

    return res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      trainer: {
        ...trainerData,
        assignedMemberCount,
        memberLimit: savedMemberLimit,
        isFull: assignedMemberCount >= savedMemberLimit,
      },
    });
  } catch (error) {
    console.error("Update trainer error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE TRAINER
exports.deleteTrainer = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID",
      });
    }

    const trainer = await User.findOne({
      _id: req.params.id,
      role: "trainer",
      isDeleted: { $ne: true },
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    const assignedMemberCount = await MemberData.countDocuments({
      assignedTrainer: trainer._id,
    });

    if (assignedMemberCount > 0) {
      return res.status(400).json({
        success: false,
        message: `This trainer has ${assignedMemberCount} assigned member(s). Reassign or remove those members before deleting this trainer.`,
        assignedMemberCount,
      });
    }

    await User.updateOne(
      { _id: trainer._id, role: "trainer" },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Trainer deleted successfully",
    });
  } catch (error) {
    console.error("Delete trainer error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SELECTED TRAINER DASHBOARD
// GET SELECTED TRAINER DASHBOARD
exports.getTrainerDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID",
      });
    }

    const trainer = await User.findOne({
      _id: id,
      role: "trainer",
      isDeleted: { $ne: true },
    })
      .select("-password")
      .lean();

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    const memberProfiles = await MemberData.find({
      assignedTrainer: trainer._id,
      isDeleted: { $ne: true },
    })
      .populate({
        path: "memberId",
        select: "name email phone status photo",
      })
      .sort({ createdAt: 1 })
      .lean();

    const assignedMembers = memberProfiles
      .filter((profile) => profile.memberId)
      .map((profile) => ({
        ...profile.memberId,
      }));

    const trainerData = await TrainerData.findOne({
      trainerId: trainer._id,
      isDeleted: { $ne: true },
    }).lean();

    const memberLimit = Number(trainerData?.memberLimit ?? 20);
    const assignedCount = assignedMembers.length;

    return res.status(200).json({
      success: true,
      trainer,
      trainerDetails: trainerData || {},
      assignedMembers,
      assignedCount,
      memberLimit,
      availableSlots: Math.max(0, memberLimit - assignedCount),
      isFull: assignedCount >= memberLimit,
    });
  } catch (error) {
    console.error("Get trainer dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load trainer dashboard",
    });
  }
};
