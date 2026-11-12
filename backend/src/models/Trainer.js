const mongoose = require("mongoose");


const trainerSchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  specialization: {
    type: String,
    trim: true,
    default: "",
  },
  experience: {
    type: String,
    min: 0,
    default: "0",
  },
  bio: {
    type: String,
    trim: true,
    default: "",
    maxlength: 500,
  },
  memberLimit: {
    type: Number,
    default: 20,
    min: 1,
  },
  description: {
    type: String,
    trim: true,
    default: "",
    maxlength: 300,
  },
 isDeleted: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps:true
});





module.exports =
  mongoose.models.TrainerData ||
  mongoose.model("TrainerData", trainerSchema);
