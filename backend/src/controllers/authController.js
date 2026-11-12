const {User} = require("../models/user");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const jwt = require("jsonwebtoken");
const { DASHBOARD_PATH } = require("../utils/roles");

 
 
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let profile = null;

    // MEMBER PROFILE
    if (user.role === "member") {
      profile = await Member.findOne({
        memberId: user._id,
      })
         
        .populate("assignedTrainer", "name email phone photo");
    }

    // TRAINER PROFILE
    if (user.role === "trainer") {
      profile = await Trainer.findOne({
        trainerId: user._id,
      })
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        photo: user.photo,
        status: user.status,

        // Profile information
        assignedTrainer: profile?.assignedTrainer || null,

        // Trainer information
        specialization: profile?.specialization || "",
        experience: profile?.experience ?? 0,
        bio: profile?.bio || "",
        memberLimit: profile?.memberLimit ?? null,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);

    return res.status(500).json({
      message: "Unable to fetch user details",
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    // Authentication
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Account status
    if (user.status === "pending") {
      return res.status(403).json({
        status: "pending",
        message:
          "Your request is still pending. The admin will contact you soon.",
      });
    }

    // Get profile for rejection information
    let profile = null;

    if (user.role === "member") {
      profile = await Member.findOne({
        memberId: user._id,
      });
    }

    if (user.role === "trainer") {
      profile = await Trainer.findOne({
        trainerId: user._id,
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        status: "rejected",
        message: profile?.rejectReason
          ? `Your request was not approved: ${profile.rejectReason}`
          : "Your request was not approved. Please contact the gym.",
      });
    }

    if (
      user.role === "trainer" &&
      user.status === "inactive"
    ) {
      return res.status(403).json({
        status: "inactive",
        message:
          "Your trainer account is inactive. Please contact the gym admin.",
      });
    }

    // Generate JWT (keep existing payload)
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    return res.json({
      message: "Login successful",
      token,

      redirectTo: DASHBOARD_PATH[user.role] || "/",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },

      profile,
    });
  } catch (err) {
    console.log("Login error:", err.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
