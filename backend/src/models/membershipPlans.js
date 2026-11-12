
const mongoose = require("mongoose");

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    duration: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String,
        enum: ["day", "week", "month"],
        default: "month",
      },
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    features: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      default: [],
    },
  ],

    limits: {
      personalTrainingSessions: {
        type: Number,
        default: 0,
        min: 0,
      },

      groupClassesPerMonth: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    freezeAllowed: {
      type: Boolean,
      default: false,
    },

    maxFreezeDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const MembershipPlan = mongoose.model(
  "MembershipPlan",
  membershipPlanSchema
);

module.exports = MembershipPlan;
