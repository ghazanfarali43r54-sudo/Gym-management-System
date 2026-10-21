const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Guard 1: kya banda logged-in hai? (token sahi hai?)
exports.protect = async (req, res, next) => {
  try {
    // Frontend token is tarah bhejega:  Authorization: Bearer <token>
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const token = header.split(" ")[1];

    // Token asli hai aur expire nahi hua? Warna yahan error aayega
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token me jo id thi, uska user abhi database me hai?
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Aage ke code ko user ka data mil jaye
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Guard 2: kya yeh banda admin hai?
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};