const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
  getMonthlyComparison,
  getMeasurements,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement,
} = require("../controllers/bodyMeasurementController");

router.use(protect);

router.get("/member/:memberId/comparison", getMonthlyComparison);
router.get("/member/:memberId", getMeasurements);
router.post("/member/:memberId", addMeasurement);
router.put("/:id", updateMeasurement);
router.delete("/:id", deleteMeasurement);

module.exports = router;
