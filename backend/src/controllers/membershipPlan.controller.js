const MembershipPlan = require("../models/membershipPlans"); // apne model ka sahi path/naam likhein
const Feature = require("../models/features");
const Member = require("../models/Member");


// CREATE
exports.createMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create({ ...req.body });
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// GET 
exports.getMembershipPlans = async (req, res) => {
  try {
    const filter = req.query.status === "active" ? { status: "active" } : {};
    const plans = await MembershipPlan.find(filter)
      .populate("features", "name category status")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateMembershipPlan = async (req, res) => {
  try {
    const { ...updates } = req.body; // gymId update nahi hone dena

    const plan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      updates,
      { returnDocument: "after", runValidators: true }
    );

    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteMembershipPlan = async (req, res) => {
  try {
    const assigned = await Member.exists({ membershipPlans: req.params.id });
    if (assigned) {
      return res.status(409).json({
        message: "This plan is assigned to one or more members and cannot be deleted.",
      });
    }
    const plan = await MembershipPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ success: true, message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
