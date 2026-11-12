const mongoose = require("mongoose");
const FitnessAssessment = require("../models/FitnessAssessment");
const { checkMemberAccess } = require("../utils/memberAccess");

const allowedFields = [
  "assessmentDate",
  "assessmentType",
  "fitnessLevel",
  "fitnessScore",
  "goals",
  "strengthLevel",
  "cardioLevel",
  "flexibilityLevel",
  "enduranceLevel",
  "tests",
  "physicalLimitations",
  "observations",
  "recommendations",
  "nextAssessmentDate",
];

function applyFields(document, body) {
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      document[field] = body[field];
    }
  });
}

// GET MEMBER FITNESS ASSESSMENT HISTORY
exports.getAssessments = async (req, res) => {
  try {
    const access = await checkMemberAccess(req, req.params.memberId);

    if (!access.member) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    const assessments = await FitnessAssessment.find({
      memberId: access.member._id,
    })
      .populate("recordedBy", "name role")
      .populate("trainerId", "name")
      .sort({ assessmentDate: -1 });

    return res.status(200).json({
      success: true,
      assessments,
    });
  } catch (error) {
    console.error("Get assessments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load fitness assessments",
    });
  }
};

// ADD FITNESS ASSESSMENT
exports.addAssessment = async (req, res) => {
  try {
    const access = await checkMemberAccess(
      req,
      req.params.memberId,
      true
    );

    if (!access.member) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    const assessment = new FitnessAssessment({
      memberId: access.member._id,
      recordedBy: req.user._id,
      trainerId: req.user.role === "trainer" ? req.user._id : null,
    });

    applyFields(assessment, req.body);

    await assessment.save();

    return res.status(201).json({
      success: true,
      message: "Fitness assessment added successfully",
      assessment,
    });
  } catch (error) {
    console.error("Add assessment error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE FITNESS ASSESSMENT
exports.updateAssessment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID",
      });
    }

    const assessment = await FitnessAssessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Fitness assessment not found",
      });
    }

    const access = await checkMemberAccess(
      req,
      assessment.memberId.toString(),
      true
    );

    if (!access.member) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    applyFields(assessment, req.body);

    await assessment.save();

    return res.status(200).json({
      success: true,
      message: "Fitness assessment updated successfully",
      assessment,
    });
  } catch (error) {
    console.error("Update assessment error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE FITNESS ASSESSMENT
exports.deleteAssessment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID",
      });
    }

    const assessment = await FitnessAssessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Fitness assessment not found",
      });
    }

    const access = await checkMemberAccess(
      req,
      assessment.memberId.toString(),
      true
    );

    if (!access.member) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    await assessment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Fitness assessment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assessment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete fitness assessment",
    });
  }
};