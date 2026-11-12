const express = require("express");
const router = express.Router();

const {
  createMembershipPlan,
  getMembershipPlans,
  updateMembershipPlan,
  deleteMembershipPlan,
} = require("../controllers/membershipPlan.controller.js");

router.get("/", getMembershipPlans);
router.post("/", createMembershipPlan);
router.put("/:id", updateMembershipPlan);
router.delete("/:id", deleteMembershipPlan);

module.exports = router;