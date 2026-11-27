const express = require("express");
const upload = require("../middlewares/upload");

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

router.post("/", upload.single("photo"), addTrainer);
router.put("/:id", upload.single("photo"), updateTrainer);
router.get("/:id/dashboard", getTrainerDashboard);
router.get("/", getTrainers);
router.post("/", addTrainer);
router.put("/:id", updateTrainer);
router.delete("/:id", deleteTrainer);

module.exports = router;