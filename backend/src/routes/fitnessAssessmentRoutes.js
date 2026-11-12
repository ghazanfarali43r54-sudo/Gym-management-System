const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
  getAssessments,
  addAssessment,
  updateAssessment,
  deleteAssessment,
} = require("../controllers/fitnessAssessmentController");

router.use(protect);

router.get("/member/:memberId", getAssessments);
router.post("/member/:memberId", addAssessment);
router.put("/:id", updateAssessment);
router.delete("/:id", deleteAssessment);

module.exports = router;