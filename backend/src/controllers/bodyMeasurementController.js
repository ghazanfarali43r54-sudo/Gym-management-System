const mongoose = require("mongoose");
const BodyMeasurement = require("../models/BodyMeasurement");
const FitnessAssessment = require("../models/FitnessAssessment");
const { checkMemberAccess } = require("../utils/memberAccess");

// Build a month-over-month snapshot for the admin progress dashboard.
exports.getMonthlyComparison = async (req, res) => {
  try {
    const access = await checkMemberAccess(req, req.params.memberId);
    if (!access.member) {
      return res.status(access.status).json({ success: false, message: access.message });
    }

    const now = new Date();
    const currentStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const previousStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const [previousMeasurements, currentMeasurements, previousAssessments, currentAssessments] = await Promise.all([
      BodyMeasurement.find({ memberId: access.member._id, measuredAt: { $gte: previousStart, $lt: currentStart } }).sort({ measuredAt: -1 }).limit(1),
      BodyMeasurement.find({ memberId: access.member._id, measuredAt: { $gte: currentStart, $lte: now } }).sort({ measuredAt: -1 }).limit(1),
      FitnessAssessment.find({ memberId: access.member._id, assessmentDate: { $gte: previousStart, $lt: currentStart } }).sort({ assessmentDate: -1 }).limit(1),
      FitnessAssessment.find({ memberId: access.member._id, assessmentDate: { $gte: currentStart, $lte: now } }).sort({ assessmentDate: -1 }).limit(1),
    ]);

    const previous = { measurement: previousMeasurements[0] || null, assessment: previousAssessments[0] || null };
    const current = { measurement: currentMeasurements[0] || null, assessment: currentAssessments[0] || null };
    const metrics = [
      ["Weight", "weight", "weightUnit", "lower"],
      ["BMI", "bmi", null, "lower"],
      ["Body fat", "bodyFatPercentage", "%", "lower"],
      ["Muscle mass", "muscleMass", "g", "higher"],
      ["Chest", "chest", "measurementUnit", "neutral"],
      ["Waist", "waist", "measurementUnit", "lower"],
      ["Hips", "hips", "measurementUnit", "neutral"],
      ["Fitness score", "fitnessScore", "/100", "higher", "assessment"],
    ];
    const report = metrics.map(([label, key, unitKey, direction, source = "measurement"]) => {
      // Either month can be missing a measurement or assessment. Keep those
      // cases in the report as insufficient data instead of throwing here.
      const before = previous[source]?.[key];
      const after = current[source]?.[key];
      if (typeof before !== "number" || typeof after !== "number") return { label, status: "insufficient_data", message: "A record is missing for one of the months." };
      const difference = Number((after - before).toFixed(2));
      let status = difference === 0 ? "unchanged" : "changed";
      if (direction === "lower") status = difference < 0 ? "improved" : difference > 0 ? "increased" : "unchanged";
      if (direction === "higher") status = difference > 0 ? "improved" : difference < 0 ? "decreased" : "unchanged";
      const unit = unitKey === "weightUnit" ? current.measurement?.weightUnit : unitKey === "measurementUnit" ? current.measurement?.measurementUnit : unitKey || "";
      return { label, previous: before, current: after, difference, unit, status };
    });
    return res.status(200).json({ success: true, periods: { previous: previousStart, current: currentStart }, previous, current, report });
  } catch (error) {
    console.error("Get monthly fitness comparison error:", error);
    return res.status(500).json({ success: false, message: "Failed to calculate monthly fitness comparison" });
  }
};

const allowedFields = [
  "measuredAt",
  "weight",
  "weightUnit",
  "height",
  "measurementUnit",
  "bodyFatPercentage",
  "bodyFatMethod",
  "muscleMass",
  "chest",
  "waist",
  "hips",
  "leftArm",
  "rightArm",
  "leftThigh",
  "rightThigh",
  "neck",
  "progressPhotos",
  "notes",
];

function applyFields(document, body) {
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      document[field] = body[field];
    }
  });
}

// GET MEMBER MEASUREMENT HISTORY
exports.getMeasurements = async (req, res) => {
  try {
    const access = await checkMemberAccess(req, req.params.memberId);

    if (!access.member) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    const measurements = await BodyMeasurement.find({
      memberId: access.member._id,
    })
      .populate("recordedBy", "name role")
      .sort({ measuredAt: -1 });

    return res.status(200).json({
      success: true,
      measurements,
    });
  } catch (error) {
    console.error("Get measurements error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load measurements",
    });
  }
};

// ADD BODY MEASUREMENT
exports.addMeasurement = async (req, res) => {
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

    const measurement = new BodyMeasurement({
      memberId: access.member._id,
      recordedBy: req.user._id,
    });

    applyFields(measurement, req.body);

    await measurement.save();

    return res.status(201).json({
      success: true,
      message: "Body measurement added successfully",
      measurement,
    });
  } catch (error) {
    console.error("Add measurement error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE BODY MEASUREMENT
exports.updateMeasurement = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid measurement ID",
      });
    }

    const measurement = await BodyMeasurement.findById(req.params.id);

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: "Measurement not found",
      });
    }

    const access = await checkMemberAccess(
      req,
      measurement.memberId.toString(),
      true
    );

    if (!access.member) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    applyFields(measurement, req.body);

    await measurement.save();

    return res.status(200).json({
      success: true,
      message: "Measurement updated successfully",
      measurement,
    });
  } catch (error) {
    console.error("Update measurement error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE BODY MEASUREMENT
exports.deleteMeasurement = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid measurement ID",
      });
    }

    const measurement = await BodyMeasurement.findById(req.params.id);

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: "Measurement not found",
      });
    }

    const access = await checkMemberAccess(
      req,
      measurement.memberId.toString(),
      true
    );

    if (!access.member) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    await measurement.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Measurement deleted successfully",
    });
  } catch (error) {
    console.error("Delete measurement error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete measurement",
    });
  }
};
