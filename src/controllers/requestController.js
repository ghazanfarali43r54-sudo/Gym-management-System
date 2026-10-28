const User = require("../models/User");
const { REQUEST_ROLES } = require("../utils/roles");

const OBJECT_ID = /^[a-f\d]{24}$/i;
const STATUSES = ["pending", "active", "rejected"];

// Search me special characters (jaise . ya () ) se regex na toote
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Sirf member ki request dhoondo (admin/trainer ko kabhi nahi)
// ?role=trainer ya ?role=member se ek type, warna dono
const roleFilter = (q) => (REQUEST_ROLES.includes(q) ? q : { $in: REQUEST_ROLES });

const findMember = (id) => (OBJECT_ID.test(id) ? User.findOne({ _id: id, role: { $in: REQUEST_ROLES } }) : null);

// Frontend ko sirf zaroori cheezein bhejo (password kabhi nahi)
function toRequest(u) {
  return {
    id: u._id,
    role: u.role, // member ya trainer
    name: u.name,
    email: u.email,
    phone: u.phone,
    message: u.message,
    photo: u.photo,
    status: u.status,
    branch: u.branch, // { name, city }
    plan: u.plan, // { name, price, durationDays }
    createdAt: u.createdAt,
    reviewedAt: u.reviewedAt,
    rejectReason: u.rejectReason,
  };
}

// GET /api/admin/requests?status=pending&q=ali&page=1&limit=20
exports.listRequests = async (req, res) => {
  try {
    const wanted = req.query.status || "pending";
    if (wanted !== "all" && !STATUSES.includes(wanted)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const filter = { role: roleFilter(req.query.role) };
    if (wanted !== "all") filter.status = wanted;

    // naam, email ya phone se dhoondna
    const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 50) : "";
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: rx }, { email: rx }, { phone: rx }];
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate("branch", "name city")
        .populate("plan", "name price durationDays")
        .sort(wanted === "pending" ? "createdAt" : "-updatedAt") // pending: pehle aane wali pehle
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      requests: users.map(toRequest),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log("List requests error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/requests/counts  -> sidebar ke badge ke liye means show no of request
exports.getCounts = async (req, res) => {
  try {
    const [pending, active, rejected] = await Promise.all(
      STATUSES.map((status) => User.countDocuments({ role: roleFilter(req.query.role), status }))
    );
    res.json({ pending, active, rejected });
  } catch (err) {
    console.log("Counts error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/requests/:id/accept
exports.acceptRequest = async (req, res) => {
  try {
    const user = await findMember(req.params.id);
    if (!user) return res.status(404).json({ message: "Request not found" });

    if (user.status === "active") {
      return res.status(409).json({ message: "This request is already accepted" });
    }

    user.status = "active";
    user.reviewedAt = new Date();
    user.reviewedBy = req.user._id;
    user.rejectReason = "";
    await user.save();

    res.json({ message: "Request accepted", request: { id: user._id, status: user.status } });
  } catch (err) {
    console.log("Accept error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/requests/:id/reject   body: { reason: "optional" }
exports.rejectRequest = async (req, res) => {
  try {
    const user = await findMember(req.params.id);
    if (!user) return res.status(404).json({ message: "Request not found" });

    if (user.status !== "pending") {
      return res.status(409).json({ message: "Only pending requests can be rejected" });
    }

    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 200) : "";

    user.status = "rejected";
    user.reviewedAt = new Date(); //yani system ko pata hy k is req kokab or kis admin ni aprove ky
    user.reviewedBy = req.user._id;// yani system ko pata hy k is req  ko bab or kis admin ni aprove ky
    user.rejectReason = reason;
    await user.save();

    res.json({ message: "Request rejected", request: { id: user._id, status: user.status } });
  } catch (err) {
    console.log("Reject error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};  