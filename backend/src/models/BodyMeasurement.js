
const mongoose = require("mongoose");

const bodyMeasurementSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    measuredAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    // Weight and height
    weight: {
      type: Number,
      min: 0,
    },

    weightUnit: {
      type: String,
      enum: ["kg", "lbs"],
      default: "kg",
    },

    height: {
      type: Number,
      min: 0,
    },

    measurementUnit: {
      type: String,
      enum: ["cm", "inch"],
      default: "cm",
    },

    // Body composition
    bodyFatPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    bodyFatMethod: {
      type: String,
      enum: [
        "smart_scale",
        "skinfold",
        "dexa",
        "bioelectrical_impedance",
        "other",
      ],
    },

    muscleMass: {
      type: Number,
      min: 0,
    },

    // Body measurements
    chest: { type: Number, min: 0 },
    waist: { type: Number, min: 0 },
    hips: { type: Number, min: 0 },

    leftArm: { type: Number, min: 0 },
    rightArm: { type: Number, min: 0 },

    leftThigh: { type: Number, min: 0 },
    rightThigh: { type: Number, min: 0 },

    neck: { type: Number, min: 0 },

    // Progress photos
    progressPhotos: {
      front: {
        type: String,
        default: "",
      },
      side: {
        type: String,
        default: "",
      },
      back: {
        type: String,
        default: "",
      },
    },

    // Automatically calculated BMI
    bmi: {
      type: Number,
      min: 0,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "bodyMeasurements",
  }
);

// Calculate BMI automatically before validation
bodyMeasurementSchema.pre("validate", function () {
  if (
    !this.weight ||
    !this.height ||
    this.weight <= 0 ||
    this.height <= 0
  ) {
    this.bmi = null;
    return;
  }

  const weightInKg =
    this.weightUnit === "lbs"
      ? this.weight * 0.45359237
      : this.weight;

  const heightInMeters =
    this.measurementUnit === "inch"
      ? this.height * 0.0254
      : this.height / 100;

  this.bmi = Number(
    (weightInKg / (heightInMeters * heightInMeters)).toFixed(2)
  );
});

// Efficient member history queries
bodyMeasurementSchema.index({
  memberId: 1,
  measuredAt: -1,
});

module.exports =
  mongoose.models.BodyMeasurement ||
  mongoose.model("BodyMeasurement", bodyMeasurementSchema);
