const express = require("express");
const { adminLogin, memberLogin, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { loginLimiter } = require("../middlewares/rateLimit");

const router = express.Router();

router.post("/admin/login", loginLimiter, adminLogin);
router.post("/member/login", loginLimiter, memberLogin);
router.get("/me", protect, getMe);

module.exports = router;