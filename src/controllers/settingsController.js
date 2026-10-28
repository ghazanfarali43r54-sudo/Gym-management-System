const Settings = require("../models/Settings");

// Sirf ye sections update ho sakte hain
const SECTIONS = [
  "general",
  "businessHours",
  "membership",
  "notifications",
  "payment",
];

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/* ================= HELPERS ================= */

// Settings na hon to defaults ke saath create kar do
async function getOrCreateSettings() {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return settings;
}

// HH:MM ko minutes mein convert karta hai
function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/*
  Business hours validation

  Check karega:
  1. time valid HH:MM ho
  2. opening < closing ho
  3. morning aur evening overlap na karein
  4. open day mein kam az kam ek session enabled ho
*/
function validateBusinessHours(businessHours) {
  for (const dayName of DAYS) {
    const day = businessHours?.[dayName];

    if (!day) {
      return `${dayName}'s settings is missing `;
    }

    // Agar pura din closed hai to sessions validate karne ki zaroorat nahi
    if (!day.isOpen) {
      continue;
    }

    const morning = day.morning;
    const evening = day.evening;

    if (!morning || !evening) {
      return `${dayName} 's morning/evening hours should be missing `;
    }

    if (!morning.enabled && !evening.enabled) {
      return `${dayName} opened,So enable at least one session`;
    }

    // Morning validation
    if (morning.enabled) {
      if (
        !TIME_REGEX.test(morning.open) ||
        !TIME_REGEX.test(morning.close)
      ) {
        return `${dayName} morning time is invalid.`;
      }

      if (
        timeToMinutes(morning.open) >=
        timeToMinutes(morning.close)
      ) {
        return `${dayName} Morning closing time must be schduled after morning opening time`;
      }
    }

    // Evening validation
    if (evening.enabled) {
      if (
        !TIME_REGEX.test(evening.open) ||
        !TIME_REGEX.test(evening.close)
      ) {
        return `${dayName} evening time is invalid `;
      }

      if (
        timeToMinutes(evening.open) >=
        timeToMinutes(evening.close)
      ) {
        return `${dayName} Morning closing time must be schduled after morning opening time`;
      }
    }

    // Dono enabled hain to overlap check karo
    if (morning.enabled && evening.enabled) {
      const morningStart = timeToMinutes(morning.open);
      const morningEnd = timeToMinutes(morning.close);

      const eveningStart = timeToMinutes(evening.open);
      const eveningEnd = timeToMinutes(evening.close);

      const overlap =
        morningStart < eveningEnd &&
        eveningStart < morningEnd;

      if (overlap) {
        return `${dayName}'s morning & evening time should not overlap.`;
      }
    }
  }

  return null;
}

/* ================= GET SETTINGS ================= */

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.json({
      settings,
    });
  } catch (err) {
    console.log("Get settings error:", err.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= UPDATE SECTION ================= */

// PUT /api/settings/:section
exports.updateSection = async (req, res) => {
  try {
    const { section } = req.params;

    if (!SECTIONS.includes(section)) {
      return res.status(400).json({
        message: "Invalid settings section",
      });
    }

    const settings = await getOrCreateSettings();

    /*
      Business Hours ki custom validation
    */
    if (section === "businessHours") {
      const error = validateBusinessHours(req.body);

      if (error) {
        return res.status(400).json({
          message: error,
        });
      }
    }

    /*
      Purani values + nayi values merge
    */
    const current = settings.toObject()[section];

    settings.set(section, {
      ...current,
      ...(req.body || {}),
    });

    /*
      Mongoose validation:
      min, max, enum, regex etc.
    */
    await settings.save();

    res.json({
      message: "Settings updated",
      settings,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");

      return res.status(400).json({
        message,
      });
    }

    console.log("Update settings error:", err.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};