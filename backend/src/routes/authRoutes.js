const express = require("express");
const { adminLogin, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/admin/login", adminLogin);
router.get("/me", protect, getMe);

module.exports = router;