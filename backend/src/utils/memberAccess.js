const mongoose = require("mongoose");
const { User } = require("../models/user");
const MemberData = require("../models/Member");

async function checkMemberAccess(req, memberId, manage = false) {
  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    return { status: 400, message: "Invalid member ID" };
  }

  const member = await User.findOne({
    _id: memberId,
    role: "member",
    status: "active",
    isDeleted: { $ne: true },
  });

  if (!member) {
    return { status: 404, message: "Active member not found" };
  }

  const role = req.user.role;

  if (role === "admin") {
    return { member };
  }

  if (role === "member") {
    if (manage) {
      return { status: 403, message: "Members have read-only access" };
    }

    if (member._id.toString() !== req.user._id.toString()) {
      return { status: 403, message: "You can only view your own records" };
    }

    return { member };
  }

  if (role === "trainer") {
    const assignment = await MemberData.findOne({
      memberId: member._id,
      assignedTrainer: req.user._id,
      isDeleted: { $ne: true },
    });

    if (!assignment) {
      return {
        status: 403,
        message: "This member is not assigned to you",
      };
    }

    return { member };
  }

  return { status: 403, message: "Access denied" };
}

module.exports = { checkMemberAccess };
