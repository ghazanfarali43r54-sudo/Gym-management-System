const express = require("express");

const {
  getTrainers,
  addTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainerDashboard,
} = require("../controllers/adminTrainerController");

const {
  protect,
  adminOnly,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/:id/dashboard", getTrainerDashboard);
router.get("/", getTrainers);
router.post("/", addTrainer);
router.put("/:id", updateTrainer);
router.delete("/:id", deleteTrainer);

module.exports = router;