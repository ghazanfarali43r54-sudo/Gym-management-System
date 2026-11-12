const {User} = require("../models/user");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const MembershipPlan = require("../models/membershipPlans");
const { REQUEST_ROLES } = require("../utils/roles");
const { validateRegistration } = require("../utils/validateRegistration");
const OBJECT_ID = /^[a-f\d]{24}$/i;

// POST /api/public/register
exports.register = async (req, res) => {
  try {
    const { errors, data } = validateRegistration(req.body || {});

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] });
    }

    if (data.role === "member" && data.membershipPlanIds.length) {
      const activePlans = await MembershipPlan.find({
        _id: { $in: data.membershipPlanIds },
        status: "active",
      }).select("_id").lean();
      if (activePlans.length !== data.membershipPlanIds.length) {
        return res.status(400).json({ message: "One or more selected membership plans are unavailable." });
      }
    }

    const existing = await User.findOne({
      email: data.email,
    });

    // =====================================
    // EXISTING USER
    // =====================================

    if (existing) {
      if (!REQUEST_ROLES.includes(existing.role)) {
        return res.status(409).json({
          message: "This email is already in use",
        });
      }

      if (existing.status === "pending") {
        return res.status(409).json({
          message:
            "Your request is already pending. The admin will contact you soon.",
        });
      }

      if (existing.status === "active") {
        return res.status(409).json({
          message: "An account with this email already exists. Please log in.",
        });
      }

      // Only rejected requests can register again
      const previousRole = existing.role;

      existing.name = data.name;
      existing.phone = data.phone;
      existing.password = data.password;
      existing.photo = data.photo;
      existing.role = data.role;
      existing.status = "pending";
      existing.gender = data.gender;
      existing.dateOfBirth = data.dateOfBirth;
     
      await existing.save();

      // If role changed, remove the old profile
      if (previousRole !== data.role) {
        await Promise.all([
          Member.deleteOne({ memberId: existing._id }),
          Trainer.deleteOne({ trainerId: existing._id }),
        ]);
      }

      // Re-create/update corresponding profile
      if (data.role === "member") {
        await Member.findOneAndUpdate(
          { memberId: existing._id },
          {
            $set: {
              assignedTrainer: null,
              membershipPlans: data.membershipPlanIds,
              address: data.address,
              emergencyContact: data.emergencyContact,
              rejectReason: "",
            },
          },
          { upsert: true, returnDocument: "after", runValidators: true }
        );
      }

      if (data.role === "trainer") {
        await Trainer.findOneAndUpdate(
          { trainerId: existing._id },
          {
            $set: {
              specialization: data.specialization,
              experience: data.experience,
              bio: data.bio,
              message: data.message,
              rejectReason: "",
            },
          },
          { upsert: true, returnDocument: "after", runValidators: true }
        );
      }

      return res.status(201).json({
        request: {
          id: existing._id,
          status: existing.status,
        },
      });
    }

    // =====================================
    // NEW USER
    // =====================================

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      photo: data.photo,
      role: data.role,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      status: "pending",
    });

    // Create only the relevant profile
    if (data.role === "member") {
      await Member.create({
        memberId: user._id,
        assignedTrainer: null,
        address: data.address,
        emergencyContact: data.emergencyContact,
        membershipPlans: data.membershipPlanIds,
      });
    }

    if (data.role === "trainer") {
      await Trainer.create({
        trainerId: user._id,
        specialization: data.specialization,
        experience: data.experience,
        bio: data.bio,
        message: data.message,
      });
    }

    return res.status(201).json({
      request: {
        id: user._id,
        status: user.status,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.log("Register error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// GET /api/public/register/:id/status  -> navbar ye poochta hai: pending / active / rejected
exports.requestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!OBJECT_ID.test(id)) {
      return res.status(404).json({ message: "Request not found" });
    }

    const user = await User.findOne({
      _id: id,
      role: { $in: REQUEST_ROLES },
    }).select("status");
    if (!user) return res.status(404).json({ message: "Request not found" });

    res.json({ status: user.status });
  } catch (err) {
    console.log("Request status error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
