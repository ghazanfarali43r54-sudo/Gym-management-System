
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
const upload = require("../middlewares/upload");

const router = express.Router();

// All routes require admin authentication
router.use(protect, adminOnly);

router.get("/", listRequests);

// Image upload middleware
router.post("/", upload.single("photo"), createMember);

router.get("/counts", getCounts);

router.patch("/:id/accept", acceptRequest);
router.patch("/:id/reject", rejectRequest);

// Image upload middleware
router.patch("/:id", upload.single("photo"), updateRequest);

router.delete("/:id", deleteRequest);

module.exports = router;
