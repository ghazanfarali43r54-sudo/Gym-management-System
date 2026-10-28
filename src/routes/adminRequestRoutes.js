const express = require("express");
const {
  listRequests,
  getCounts,
  acceptRequest,
  rejectRequest,
} = require("../controllers/requestController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// is file ke saare routes sirf logged-in admin ke liye hain 
router.use(protect, adminOnly);

router.get("/", listRequests);
router.get("/counts", getCounts);
router.patch("/:id/accept", acceptRequest);
router.patch("/:id/reject", rejectRequest);

module.exports = router;