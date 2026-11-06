const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
   
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    description: { type: String,
      trim: true,
      default: "",
      maxlength: 300
     },
     isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.MemberData || mongoose.model("MemberData", memberSchema);
