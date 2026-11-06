const express = require("express");
const { login, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", login); // admin, trainer aur member, sab ke liye
router.get("/me", protect, getMe);

module.exports = router;
