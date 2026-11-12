const mongoose = require("mongoose");
const { addressSchema, emergencyContactSchema } = require("./user");

const memberSchema = new mongoose.Schema(
  {
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    membershipPlans: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
    }],

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    description: { type: String, trim: true, default: "", maxlength: 300 },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    address: {
      type: addressSchema,
      default: () => ({}),
    },
    emergencyContact: {
      type: emergencyContactSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.MemberData || mongoose.model("MemberData", memberSchema);
