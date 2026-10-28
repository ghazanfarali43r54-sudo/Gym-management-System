const express = require("express");
const Branch = require("../models/Branch");
const Plan = require("../models/Plan");
const User = require("../models/User");
const crud = require("../utils/crud");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// is file ke saare routes sirf logged-in admin ke liye hain
router.use(protect, adminOnly);

const branches = crud(
  Branch,
  ["name", "city", "address", "phone", "isActive"],
  (id) => User.exists({ branch: id }),
  "Branch"
);
const plans = crud(
  Plan,
  ["name", "price", "durationDays", "description", "isActive"],
  (id) => User.exists({ plan: id }),
  "Plan"
);

router.get("/branches", branches.list);
router.post("/branches", branches.create);
router.put("/branches/:id", branches.update);
router.delete("/branches/:id", branches.remove);

router.get("/plans", plans.list);
router.post("/plans", plans.create);
router.put("/plans/:id", plans.update);
router.delete("/plans/:id", plans.remove);

module.exports = router;