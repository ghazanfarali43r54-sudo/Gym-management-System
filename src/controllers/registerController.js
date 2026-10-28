const User = require("../models/User");
const Branch = require("../models/Branch");
const Plan = require("../models/Plan");
const { REQUEST_ROLES } = require("../utils/roles");
const { validateRegistration } = require("../utils/validateRegistration");

const OBJECT_ID = /^[a-f\d]{24}$/i;

// POST /api/public/register  -> member ki request (status: pending)
exports.register = async (req, res) => {
  try {
    const { errors, data } = validateRegistration(req.body || {});
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] });
    }

    // branch aur plan sach me maujood aur active hain?
    const [branch, plan] = await Promise.all([
      Branch.findOne({ _id: data.branchId, isActive: true }),
      data.role === "member" ? Plan.findOne({ _id: data.planId, isActive: true }) : null, // trainer ka plan nahi hota
    ]);
    if (!branch) return res.status(400).json({ message: "Selected branch is not available" });
    if (data.role === "member" && !plan) return res.status(400).json({ message: "Selected plan is not available" });

    const existing = await User.findOne({ email: data.email });

    if (existing) {
      // admin ya trainer ki email par kuch nahi karna
      if (!REQUEST_ROLES.includes(existing.role)) {
        return res.status(409).json({ message: "This email is already in use" });
      }
      if (existing.status === "pending") {
        return res.status(409).json({ message: "Your request is already pending. The admin will contact you soon." });
      }
      if (existing.status === "active") {
        return res.status(409).json({ message: "An account with this email already exists. Please log in." });
      }

      // rejected tha: naye data ke saath dobara request ki ijazat
      existing.name = data.name;
      existing.phone = data.phone;
      existing.password = data.password;
      existing.branch = branch._id;
      existing.role = data.role;
      existing.plan = plan ? plan._id : null;
      existing.photo = data.photo;
      existing.message = data.message;
      existing.status = "pending";
      await existing.save();

      return res.status(201).json({ request: { id: existing._id, status: existing.status } });
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password, // save hone se pehle apne aap hash hota hai
      role: data.role,
      status: "pending",
      branch: branch._id,
      plan: plan ? plan._id : null,
      photo: data.photo,
      message: data.message,
    });

    res.status(201).json({ request: { id: user._id, status: user.status } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    console.log("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/public/register/:id/status  -> navbar ye poochta hai: pending / active / rejected
exports.requestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!OBJECT_ID.test(id)) {
      return res.status(404).json({ message: "Request not found" });
    }

    const user = await User.findOne({ _id: id, role: { $in: REQUEST_ROLES } }).select("status");
    if (!user) return res.status(404).json({ message: "Request not found" });

    res.json({ status: user.status });
  } catch (err) {
    console.log("Request status error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};