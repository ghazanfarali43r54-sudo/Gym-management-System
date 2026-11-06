const User = require("../models/user");
const Member = require("../models/Member");
const TrainerData = require("../models/Trainer");
const { REQUEST_ROLES } = require("../utils/roles");

const OBJECT_ID = /^[a-f\d]{24}$/i;
const STATUSES = ["pending", "active", "rejected"];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const roleFilter = (role) =>
  REQUEST_ROLES.includes(role) ? role : { $in: REQUEST_ROLES };

const findMember = (id) =>
  OBJECT_ID.test(String(id))
    ? User.findOne({
        _id: id,
        role: { $in: REQUEST_ROLES },
        isDeleted: { $ne: true },
      })
    : null;

// Convert User + profile into the object expected by the frontend.

function toRequest(user, profile = {}) {
  if (!user) return null;

  return {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
    phone: user.phone,
    photo: user.photo || "",
    status: user.status,

    assignedTrainer: profile.assignedTrainer || null,

    specialization: profile.specialization || "",
    experience: profile.experience ?? 0,
    bio: profile.bio || "",
    memberLimit: profile.memberLimit ?? null,

    createdAt: user.createdAt,
  };
}


// POST /api/admin/requests
// Create a member directly from admin panel.
exports.createMember = async (req, res) => {
  let createdUser = null;

  try {
    const {
      name,
      email,
      phone,
      password,
      status,
      assignedTrainerId,
    } = req.body || {};

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPhone = typeof phone === "string" ? phone.trim() : "";

    if (cleanName.length < 2 || cleanName.length > 60) {
      return res.status(400).json({
        message: "Name must be 2 to 60 characters",
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || cleanEmail.length > 100) {
      return res.status(400).json({
        message: "Enter a valid email",
      });
    }

    if (!/^\+?[\d\s-]{10,15}$/.test(cleanPhone)) {
      return res.status(400).json({
        message: "Enter a valid phone number",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Password must be 6 to 72 characters",
      });
    }

    const memberStatus =
      status === undefined ? "active" : String(status).toLowerCase();

    if (!["pending", "active", "inactive"].includes(memberStatus)) {
      return res.status(400).json({
        message: "Invalid member status",
      });
    }

    


    if (assignedTrainerId && !OBJECT_ID.test(String(assignedTrainerId))) {
      return res.status(400).json({ message: "Invalid trainer" });
    }

    const [ existing, trainer] = await Promise.all([


      User.findOne({ email: cleanEmail }),

      assignedTrainerId
        ? User.findOne({
            _id: assignedTrainerId,
            role: "trainer",
            status: "active",
          })
        : null,
    ]);

     

    

    if (assignedTrainerId && !trainer) {
      return res.status(400).json({
        message: "Selected trainer is not available",
      });
    }

    if (existing) {
      return res.status(409).json({
        message: "This email is already in use",
      });
    }

    if (trainer) {
      const [assignedCount, trainerData] = await Promise.all([
        Member.countDocuments({ assignedTrainer: trainer._id }),
        TrainerData.findOne({ trainerId: trainer._id }).lean(),
      ]);

      const memberLimit = Number(trainerData?.memberLimit ?? 20);

      if (assignedCount >= memberLimit) {
        return res.status(400).json({
          message: `Selected trainer has reached the ${memberLimit}-member limit`,
        });
      }
    }

    // Create authentication record.
    createdUser = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      role: "member",
      status: memberStatus,
    });

    // Create member profile separately.
    const memberProfile = await Member.create({
      memberId: createdUser._id,
      
      assignedTrainer: trainer?._id || null,
    });

    return res.status(201).json({
      message: "Member created",
      request: toRequest(createdUser, memberProfile),
    });
  } catch (err) {
    // Avoid leaving a User without a MemberData profile.
    if (createdUser?._id) {
      await User.deleteOne({ _id: createdUser._id }).catch(() => {});
    }

    if (err.code === 11000) {
      return res.status(409).json({
        message: "This email is already in use",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(err.errors)
          .map((error) => error.message)
          .join(", "),
      });
    }

    console.log("Create member error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/requests
exports.listRequests = async (req, res) => {
  try {
    const wanted = req.query.status || "pending";

    if (wanted !== "all" && !STATUSES.includes(wanted)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const filter = {
      role: roleFilter(req.query.role),
      isDeleted: { $ne: true },
    };

    if (wanted !== "all") {
      filter.status = wanted;
    }

    const q =
      typeof req.query.q === "string" ? req.query.q.trim().slice(0, 50) : "";

    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");

      filter.$or = [{ name: rx }, { email: rx }, { phone: rx }];
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      50
    );

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort(wanted === "pending" ? "createdAt" : "-updatedAt")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    const memberIds = users
      .filter((u) => u.role === "member")
      .map((u) => u._id);

    const trainerIds = users
      .filter((u) => u.role === "trainer")
      .map((u) => u._id);

    // Fetch member profiles.
    const memberProfiles = await Member.find({
      memberId: { $in: memberIds },
    })
    //!when i want to add brainhes then i just uncument this & update admintrainerdashboard function..below:
      .populate("assignedTrainer", "name email phone photo")
      .lean();

    // Fetch trainer profiles.
    const trainerProfiles = await TrainerData.find({
      trainerId: { $in: trainerIds },
    })
      .lean();

    const memberMap = new Map(
      memberProfiles.map((profile) => [String(profile.memberId), profile])
    );

    const trainerMap = new Map(
      trainerProfiles.map((profile) => [String(profile.trainerId), profile])
    );

    const requests = users.map((user) => {
      const profile =
        user.role === "member"
          ? memberMap.get(String(user._id))
          : trainerMap.get(String(user._id));

      return toRequest(user, profile || {});
    });

    return res.json({
      requests,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log("List requests error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/requests/counts
exports.getCounts = async (req, res) => {
  try {
    const role = roleFilter(req.query.role);

    const [pending, active, rejected] = await Promise.all([
      User.countDocuments({
        role,
        status: "pending",
        isDeleted: { $ne: true },
      }),

      User.countDocuments({
        role,
        status: "active",
        isDeleted: { $ne: true },
      }),

      User.countDocuments({
        role,
        status: "rejected",
        isDeleted: { $ne: true },
      }),
    ]);

    return res.json({ pending, active, rejected });
  } catch (err) {
    console.log("Counts error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/requests/:id/accept
exports.acceptRequest = async (req, res) => {
  try {
    const user = await findMember(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (user.status === "active") {
      return res.status(409).json({
        message: "This request is already accepted",
      });
    }

    const ProfileModel = user.role === "member" ? Member : TrainerData;

    const profileField = user.role === "member" ? "memberId" : "trainerId";

    const profile = await ProfileModel.findOne({
      [profileField]: user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    profile.rejectReason = "";

    user.status = "active";

    await Promise.all([profile.save(), user.save()]);

    return res.json({
      message: "Request accepted",
      request: {
        id: user._id,
        status: user.status,
      },
    });
  } catch (err) {
    console.log("Accept error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/requests/:id/reject
exports.rejectRequest = async (req, res) => {
  try {
    const user = await findMember(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (user.status !== "pending") {
      return res.status(409).json({
        message: "Only pending requests can be rejected",
      });
    }

    const reason =
      typeof req.body?.reason === "string"
        ? req.body.reason.trim().slice(0, 200)
        : "";

    const ProfileModel = user.role === "member" ? Member : TrainerData;

    const profileField = user.role === "member" ? "memberId" : "trainerId";

    const profile = await ProfileModel.findOne({
      [profileField]: user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    profile.rejectReason = reason;

    user.status = "rejected";

    await Promise.all([profile.save(), user.save()]);

    return res.json({
      message: "Request rejected",
      request: {
        id: user._id,
        status: user.status,
      },
    });
  } catch (err) {
    console.log("Reject error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/requests/:id
exports.updateRequest = async (req, res) => {
  try {
    if (!OBJECT_ID.test(String(req.params.id))) {
      return res.status(404).json({ message: "Member not found" });
    }

    const user = await User.findOne({
      _id: req.params.id,
      role: "member",
      isDeleted: { $ne: true },
    });
    if (!user) {
      return res.status(404).json({ message: "Member not found" });
    }

    const profile = await Member.findOne({
      memberId: user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Member profile not found",
      });
    }

    const { name, email, phone, status, assignedTrainerId } =
      req.body || {};

    // Update User fields.
    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (cleanName.length < 2 || cleanName.length > 60) {
        return res.status(400).json({
          message: "Name must be 2 to 60 characters",
        });
      }

      user.name = cleanName;
    }

    if (email !== undefined) {
      const cleanEmail = String(email).trim().toLowerCase();

      if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || cleanEmail.length > 100) {
        return res.status(400).json({
          message: "Enter a valid email",
        });
      }

      user.email = cleanEmail;
    }

    if (phone !== undefined) {
      const cleanPhone = String(phone).trim();

      if (!/^\+?[\d\s-]{10,15}$/.test(cleanPhone)) {
        return res.status(400).json({
          message: "Enter a valid phone number",
        });
      }

      user.phone = cleanPhone;
    }

  

 
    
 
    // Update trainer assignment in MemberData.
    if (assignedTrainerId !== undefined) {
      if (assignedTrainerId && !OBJECT_ID.test(String(assignedTrainerId))) {
        return res.status(400).json({ message: "Invalid trainer" });
      }

      const isCurrentAssignment =
        assignedTrainerId &&
        String(profile.assignedTrainer || "") === String(assignedTrainerId);

      const trainer = assignedTrainerId
        ? await User.findOne({
            _id: assignedTrainerId,
            role: "trainer",
            ...(isCurrentAssignment ? {} : { status: "active" }),
          })
        : null;

      if (assignedTrainerId && !trainer) {
        return res.status(400).json({
          message: "Selected trainer is not available",
        });
      }

      if (
        trainer &&
        String(profile.assignedTrainer || "") !== String(trainer._id)
      ) {
        const [assignedCount, trainerData] = await Promise.all([
          Member.countDocuments({
            assignedTrainer: trainer._id,
          }),
          TrainerData.findOne({
            trainerId: trainer._id,
          }).lean(),
        ]);

        const memberLimit = Number(trainerData?.memberLimit ?? 20);

        if (assignedCount >= memberLimit) {
          return res.status(400).json({
            message: `Selected trainer has reached the ${memberLimit}-member limit`,
          });
        }
      }

      profile.assignedTrainer = trainer?._id || null;
    }

    // Status belongs to User, not MemberData.
    if (status !== undefined) {
      const newStatus = String(status).toLowerCase();

      if (!["active", "inactive", "pending", "rejected"].includes(newStatus)) {
        return res.status(400).json({
          message: "Invalid member status",
        });
      }

      user.status = newStatus;
    }

    await Promise.all([user.save(), profile.save()]);

    const updatedProfile = await Member.findOne({
      memberId: user._id,
    })
      .populate("assignedTrainer", "name email phone photo")
      .lean();

    return res.json({
      message: "Member updated",
      request: toRequest(user, updatedProfile || {}),
    });
  } catch (err) {
    console.log("Update request error:", err.message);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(err.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid value for ${err.path}`,
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        message: "A member with this email already exists",
      });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/requests/:id
exports.deleteRequest = async (req, res) => {
  try {
    if (!OBJECT_ID.test(String(req.params.id))) {
      return res.status(404).json({ message: "Member not found" });
    }

    const user = await User.findOne({
      _id: req.params.id,
      role: "member",
      isDeleted: { $ne: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Soft delete user
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      }
    );

    return res.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.log("Delete request error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
