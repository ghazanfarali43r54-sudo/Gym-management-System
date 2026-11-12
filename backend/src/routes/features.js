const express = require("express");
const router = express.Router();

const Feature = require("../models/features");

const {
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} = require("../controllers/featureController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

// PUBLIC ROUTE
// Only active features show honge
router.get("/", async (req, res) => {
  try {
    const features = await Feature.find({
      status: "active",
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: features,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADMIN ROUTES
router.get("/admin", protect, adminOnly, getFeatures);

router.post("/", protect, adminOnly, createFeature);

router.put("/:id", protect, adminOnly, updateFeature);

router.delete("/:id", protect, adminOnly, deleteFeature);

module.exports = router;
