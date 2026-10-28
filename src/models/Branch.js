const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    city: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true }, // band branch dropdown me nahi dikhegi
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);