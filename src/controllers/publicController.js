const Branch = require("../models/Branch");
const Plan = require("../models/Plan");

// GET /api/public/branches
exports.getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true })
      .select("name city address phone")
      .sort("name");
    res.json({ branches });
  } catch (err) {
    console.log("Get branches error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/public/plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true })
      .select("name price durationDays description")
      .sort("price");
    res.json({ plans });
  } catch (err) {
    console.log("Get plans error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};