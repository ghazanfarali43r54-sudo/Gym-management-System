const express = require("express");
const { register, requestStatus } = require("../controllers/registerController");
const { setting, getSiteSettings } = require("../controllers/publicController")

const router = express.Router();


router.post("/register", register);
router.get("/register/:id/status", requestStatus);
//!todo: remove this route after testing
router.get("/settings", getSiteSettings);

module.exports = router;