const {User} = require("../models/user");
const TrainerData = require("../models/Trainer");
const MemberData = require("../models/Member");
const mongoose = require("mongoose");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");

// GET ALL ACTIVE AND INACTIVE TRAINERS
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({
      role: "trainer",
      status: { $in: ["active", "inactive"] },
      isDeleted: { $ne: true },
    })
      .select(
        "name email phone photo gender dateOfBirth status createdAt"
      )
      .sort({ name: 1 })
      .lean();

    const trainerIds = trainers.map((trainer) => trainer._id);

    const trainerDataList = await TrainerData.find({
      trainerId: { $in: trainerIds },
      isDeleted: { $ne: true },
    }).lean();

    const trainerDataMap = new Map();

    trainerDataList.forEach((data) => {
      trainerDataMap.set(String(data.trainerId), data);
    });

    const trainersWithCount = await Promise.all(
      trainers.map(async (trainer) => {
        const data = trainerDataMap.get(String(trainer._id));

        const assignedMemberCount = await MemberData.countDocuments({
          assignedTrainer: trainer._id,
        });

        const memberLimit = Number(data?.memberLimit ?? 20);

        return {
          ...trainer,
          specialization: data?.specialization || "",
          experience: data?.experience || 0,
          bio: data?.bio || "",
          address: data?.address || {
            street: "",
            city: "",
            country: "",
          },
          memberLimit,
          assignedMemberCount,
          isFull: assignedMemberCount >= memberLimit,
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
  let createdUser = null;
  let uploadedPhoto = null;

  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      experience,
      status,
      gender,
      dateOfBirth,
    } = req.body;

    let address = {};

    try {
      address =
        typeof req.body.address === "string"
          ? JSON.parse(req.body.address)
          : req.body.address || {};
    } catch {
      return res.status(422).json({
        success: false,
        message: "Invalid address data",
      });
    }

    const requestedLimit =
      req.body.memberLimit === undefined
        ? 20
        : Number(req.body.memberLimit);

    if (!Number.isSafeInteger(requestedLimit) || requestedLimit < 1) {
      return res.status(400).json({
        success: false,
        message: "Member limit must be a positive whole number",
      });
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

    // Validate date of birth.
    let parsedDateOfBirth = null;

    if (dateOfBirth) {
      parsedDateOfBirth = new Date(dateOfBirth);

      if (Number.isNaN(parsedDateOfBirth.getTime())) {
        return res.status(422).json({
          success: false,
          message: "Invalid date of birth",
        });
      }
    }

    // Upload profile photo.
    if (req.file) {
      uploadedPhoto = await uploadToCloudinary(req.file.buffer);
    }

    createdUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone?.trim() || "",
      gender: gender ? gender.toLowerCase() : "",
      dateOfBirth: parsedDateOfBirth,
      photo: uploadedPhoto?.url || "",
      photoPublicId: uploadedPhoto?.publicId || "",
      status: status === "inactive" ? "inactive" : "active",
      role: "trainer",
    });

    const trainerProfile = await TrainerData.create({
      trainerId: createdUser._id,
      specialization: specialization || "",
      experience: String(Number(experience) || 0),
      memberLimit: requestedLimit,
      address,
    });

    const trainerData = createdUser.toObject();
    delete trainerData.password;

    return res.status(201).json({
      success: true,
      message: "Trainer added successfully",
      trainer: {
        ...trainerData,
        specialization: trainerProfile.specialization,
        experience: trainerProfile.experience,
        address: trainerProfile.address,
        assignedMemberCount: 0,
        memberLimit: requestedLimit,
        isFull: false,
      },
    });
  } catch (error) {
    if (createdUser?._id) {
      await User.deleteOne({ _id: createdUser._id }).catch(() => {});
      await TrainerData.deleteOne({
        trainerId: createdUser._id,
      }).catch(() => {});
    }

    if (uploadedPhoto?.publicId) {
      await deleteFromCloudinary(uploadedPhoto.publicId).catch(() => {});
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    console.error("Add trainer error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE TRAINER
exports.updateTrainer = async (req, res) => {
  let uploadedPhoto = null;
  let databaseUpdated = false;

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
      gender,
      dateOfBirth,
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
      isDeleted: { $ne: true },
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    const trainerProfile = await TrainerData.findOne({
      trainerId: trainer._id,
    });

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
    if (phone !== undefined) trainer.phone = phone.trim();

    if (gender !== undefined) {
      trainer.gender = gender ? gender.toLowerCase() : "";
    }

    if (dateOfBirth !== undefined) {
      const parsedDate = dateOfBirth ? new Date(dateOfBirth) : null;

      if (parsedDate && Number.isNaN(parsedDate.getTime())) {
        return res.status(422).json({
          success: false,
          message: "Invalid date of birth",
        });
      }

      trainer.dateOfBirth = parsedDate;
    }

    if (status !== undefined) {
      const normalizedStatus = status.toLowerCase();

      if (!["active", "inactive"].includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid trainer status",
        });
      }

      trainer.status = normalizedStatus;
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

    let validatedMemberLimit;
    if (memberLimit !== undefined) {
      const limit = Number(memberLimit);

      if (!Number.isSafeInteger(limit) || limit < 1) {
        return res.status(400).json({
          success: false,
          message: "Member limit must be a positive whole number",
        });
      }

      validatedMemberLimit = limit;
    }

    let address;
    if (req.body.address !== undefined) {
      try {
        address =
          typeof req.body.address === "string"
            ? JSON.parse(req.body.address)
            : req.body.address;
      } catch {
        return res.status(422).json({
          success: false,
          message: "Invalid address data",
        });
      }

      if (
        !address ||
        typeof address !== "object" ||
        Array.isArray(address)
      ) {
        return res.status(422).json({
          success: false,
          message: "Invalid address data",
        });
      }
    }

    const oldPhotoPublicId = trainer.photoPublicId;

    // Upload new photo.
    if (req.file) {
      uploadedPhoto = await uploadToCloudinary(req.file.buffer);

      trainer.photo = uploadedPhoto.url;
      trainer.photoPublicId = uploadedPhoto.publicId;
    } else if (req.body.removePhoto === "true") {
      trainer.photo = "";
      trainer.photoPublicId = "";
    }

    // Update authentication record.
    await trainer.save();

    // Update trainer profile.
    const profileUpdate = {};

    if (specialization !== undefined) {
      profileUpdate.specialization = specialization;
    }

    if (validatedExperience !== undefined) {
      profileUpdate.experience = validatedExperience;
    }

    if (validatedMemberLimit !== undefined) {
      profileUpdate.memberLimit = validatedMemberLimit;
    }

    if (address !== undefined) {
      profileUpdate.address = address;
    }

    const savedTrainerData = await TrainerData.findOneAndUpdate(
      { trainerId: trainer._id },
      {
        $set: profileUpdate,
        $setOnInsert: { trainerId: trainer._id },
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    databaseUpdated = true;

    // Delete old photo only after successful database update.
    if (
      oldPhotoPublicId &&
      oldPhotoPublicId !== trainer.photoPublicId
    ) {
      await deleteFromCloudinary(oldPhotoPublicId).catch(() => {});
    }

    const assignedMemberCount = await MemberData.countDocuments({
      assignedTrainer: trainer._id,
    });

    const savedMemberLimit = Number(
      savedTrainerData?.memberLimit ?? 20
    );

    const trainerData = trainer.toObject();
    delete trainerData.password;

    return res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      trainer: {
        ...trainerData,
        specialization: savedTrainerData?.specialization || "",
        experience: savedTrainerData?.experience || 0,
        address: savedTrainerData?.address || {
          street: "",
          city: "",
          country: "",
        },
        assignedMemberCount,
        memberLimit: savedMemberLimit,
        isFull: assignedMemberCount >= savedMemberLimit,
      },
    });
  } catch (error) {
    if (!databaseUpdated && uploadedPhoto?.publicId) {
      await deleteFromCloudinary(uploadedPhoto.publicId).catch(() => {});
    }

    if (error.name === "ValidationError") {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, item]) => [
          field,
          item.message,
        ])
      );

      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    console.error("Update trainer error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE TRAINER

// PERMANENT DELETE TRAINER
exports.deleteTrainer = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID",
      });
    }

    let result = null;

    await session.withTransaction(async () => {
      // Find trainer
      const trainer = await User.findOne({
        _id: req.params.id,
        role: "trainer",
        isDeleted: { $ne: true },
      }).session(session);

      if (!trainer) {
        result = {
          status: 404,
          message: "Trainer not found",
        };
        return;
      }

      // Check assigned members
      const assignedMemberCount = await MemberData.countDocuments({
        assignedTrainer: trainer._id,
      }).session(session);

      if (assignedMemberCount > 0) {
        result = {
          status: 400,
          message: `This trainer has ${assignedMemberCount} assigned member(s). Reassign or remove those members before deleting this trainer.`,
          assignedMemberCount,
        };
        return;
      }

      // Delete trainer profile
      await TrainerData.deleteMany({
        trainerId: trainer._id,
      }).session(session);

      // Permanently delete trainer account
      const deletedTrainer = await User.deleteOne({
        _id: trainer._id,
        role: "trainer",
      }).session(session);

      if (deletedTrainer.deletedCount !== 1) {
        throw new Error("Trainer account could not be deleted");
      }

      result = {
        status: 200,
        success: true,
        message: "Trainer permanently deleted successfully",
      };
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Permanent delete trainer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to permanently delete trainer",
    });
  } finally {
    await session.endSession();
  }
};


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
