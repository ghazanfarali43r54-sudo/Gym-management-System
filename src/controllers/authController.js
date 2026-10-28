const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { REQUEST_ROLES } = require("../utils/roles");

// POST /api/auth/admin/login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // 1. email aur password aaye hain ya nahi
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. user dhoondo (password select:false hai, isliye .select("+password") lagaya)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // 3. user na mile, ya admin na ho, ya password galat ho -> same message
    //    (alag alag message dene se koi andaza laga sakta hai ke email sahi hai)
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. token banao
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // 5. jawab bhejo (password kabhi nahi bhejte)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/me  -> logged-in banda kaun hai
exports.getMe = (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// POST /api/auth/member/login
exports.memberLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    // user na mile, ya member na ho, ya password galat ho -> same message
    if (!user || !REQUEST_ROLES.includes(user.role)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Password sahi hai, ab request ka haal dekho
    if (user.status === "pending") {
      return res.status(403).json({
        status: "pending",
        message: "Your request is still pending. The admin will contact you soon.",
      });
    }
    if (user.status === "rejected") {
      return res.status(403).json({
        status: "rejected",
        message: user.rejectReason
          ? `Your request was not approved: ${user.rejectReason}`
          : "Your request was not approved. Please contact the gym.",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.log("Member login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};