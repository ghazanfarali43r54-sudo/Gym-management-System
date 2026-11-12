
const mongoose = require("mongoose");

// Individual fitness test
const fitnessTestSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
      trim: true,
    },

    result: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  }
);

const fitnessAssessmentSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assessmentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    // Assessment information
    assessmentType: {
      type: String,
      enum: ["initial", "monthly", "final"],
      required: true,
    },

    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    fitnessScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    goals: {
      type: [String],
      default: [],
    },

    // Fitness evaluation
    strengthLevel: {
      type: String,
      enum: ["poor", "average", "good", "excellent"],
    },

    cardioLevel: {
      type: String,
      enum: ["poor", "average", "good", "excellent"],
    },

    flexibilityLevel: {
      type: String,
      enum: ["poor", "average", "good", "excellent"],
    },

    enduranceLevel: {
      type: String,
      enum: ["poor", "average", "good", "excellent"],
    },

    // Fitness tests
    tests: {
      type: [fitnessTestSchema],
      default: [],
    },

    physicalLimitations: {
      type: String,
      trim: true,
      maxlength: 1500,
      default: "",
    },

    observations: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    recommendations: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    nextAssessmentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "fitnessAssessments",
  }
);

// Efficient member assessment history queries
fitnessAssessmentSchema.index({
  memberId: 1,
  assessmentDate: -1,
});

module.exports =
  mongoose.models.FitnessAssessment ||
  mongoose.model("FitnessAssessment", fitnessAssessmentSchema);
