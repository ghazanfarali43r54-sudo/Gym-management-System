const express = require("express");
const {
  listRequests,
  createMember,
  getCounts,
  acceptRequest,
  rejectRequest,
  updateRequest,
  deleteRequest,
} = require("../controllers/requestController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// is file ke saare routes sirf logged-in admin ke liye hain
router.use(protect, adminOnly);

router.get("/", listRequests);
router.post("/", createMember);
router.get("/counts", getCounts);
router.patch("/:id/accept", acceptRequest);
router.patch("/:id/reject", rejectRequest);
router.patch("/:id", updateRequest);
router.delete("/:id", deleteRequest);

module.exports = router;
