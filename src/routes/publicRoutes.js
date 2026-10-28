const express = require("express");
const { getBranches, getPlans } = require("../controllers/publicController");
const { register, requestStatus } = require("../controllers/registerController");
const { registerLimiter, statusLimiter } = require("../middlewares/rateLimit");

const router = express.Router();

router.get("/branches", getBranches);
router.get("/plans", getPlans);

router.post("/register", registerLimiter, register);
router.get("/register/:id/status", statusLimiter, requestStatus);

module.exports = router;