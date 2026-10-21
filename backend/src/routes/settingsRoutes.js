const express = require("express");
const { getSettings, updateSection } = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// is file ke saare routes sirf logged-in admin ke liye hain
router.use(protect, adminOnly);

router.get("/", getSettings);
router.put("/:section", updateSection);

module.exports = router;