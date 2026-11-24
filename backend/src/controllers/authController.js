const { User } = require("../models/user");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const jwt = require("jsonwebtoken");
const { DASHBOARD_PATH } = require("../utils/roles");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail").sendEmail;

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
      }).populate("assignedTrainer", "name email phone photo");
    }

    // TRAINER PROFILE
    if (user.role === "trainer") {
      profile = await Trainer.findOne({
        trainerId: user._id,
      });
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

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    // 1. Validate email
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // 2. Find user
    const normalizedEmail = email.trim().toLowerCase();

    console.log("Received email:", normalizedEmail);

    const user = await User.findOne({
      email: normalizedEmail,
      isDeleted: { $ne: true },
    });

    console.log("User found:", Boolean(user));

    // 3. Do not reveal whether email exists
    const successMessage =
      "If an account exists with this email, a reset link will be sent.";

    if (!user) {
      return res.json({
        message: successMessage,
      });
    }

    // 4. Generate secure random token   {orignal token}
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 5. Hash token for database storage{hash version db me store  }
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 6. Save token and expiry
    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    // 7. Create reset password URL
    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, "");

    const resetUrl =
      //(Email mein original token jayega, database mein hashed token rahega.)
      `${frontendUrl}/reset-password/${resetToken}`;

    // 8. Send reset email
    try {
      const emailInfo = await sendEmail({
        to: user.email,
        subject: "Gym Management - Password Reset",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 550px; margin: auto; padding: 25px; color: #333;">

            <h2 style="color: #913d4c;">
              Reset Your Password
            </h2>

            <p>Hello ${user.name},</p>

            <p>
              We received a request to reset your
              Gym Management account password.
            </p>

            <p>
              Click the button below to create a new password.
            </p>

            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 14px 25px;
                background-color: #913d4c;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>

            <p style="margin-top: 25px;">
              This link will expire in 15 minutes.
            </p>

            <p>
              If you did not request a password reset,
              you can safely ignore this email.
            </p>

            <hr style="border: 0; border-top: 1px solid #eee;" />

            <p style="font-size: 12px; color: #888;">
              Gym Management System
            </p>

          </div>
        `,
      });
      console.log("Reset email accepted:", emailInfo.accepted);
      console.log("Reset email rejected:", emailInfo.rejected);
      console.log("Reset email messageId:", emailInfo.messageId);
    } catch (emailError) {
      // Clear token if email could not be sent
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      throw emailError;
    }

    // 9. Send response
    return res.json({
      message: successMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Unable to send password reset email",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body || {};

    // 1. Validate token
    if (!token || typeof token !== "string") {
      return res.status(400).json({
        message: "Invalid or missing reset token",
      });
    }

    // 2. Validate passwords
    if (
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "Both password fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // 3. Hash received token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 4. Find user with valid, non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
      isDeleted: { $ne: true },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired",
      });
    }

    // 5. Update password
    user.password = password;

    // 6. Remove reset token after successful reset
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message:
        "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Unable to reset password",
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

    if (user.role === "trainer" && user.status === "inactive") {
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
