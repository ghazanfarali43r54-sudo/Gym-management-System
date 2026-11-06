const Settings = require("../models/Settings");


// GET /api/public/settings  -> sirf woh settings jo website par sab ko dikhti hain
exports.getSiteSettings = async (req, res) => {
  try {
    // abhi settings na bani hon to defaults bhej do (database me kuch likhe baghair)
    const s = (await Settings.findOne({ key: "main" })) || new Settings();
    const { general, businessHours, payment } = s.toObject();

    res.json({
      general,
      businessHours,
      payment: { methods: payment.methods }, // tax / invoice jaisi cheezein bahar nahi jati
    });
  } catch (err) {
    console.log("Site settings error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};