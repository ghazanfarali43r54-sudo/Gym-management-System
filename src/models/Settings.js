const mongoose = require("mongoose");

// Time format: HH:MM
// Examples: 06:00, 08:30, 14:00, 23:00
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

/*
  Ek session ka structure:

  {
    enabled: true,
    open: "06:00",
    close: "08:30"
  }
*/
const session = (open, close, enabled = true) => ({
  enabled: {
    type: Boolean,
    default: enabled,
  },

  open: {
    type: String,
    default: open,
    match: [timeRegex, "Time must be HH:MM"],
  },

  close: {
    type: String,
    default: close,
    match: [timeRegex, "Time must be HH:MM"],
  },
});

/*
  Har din ke andar:
  - isOpen = pura din open/closed
  - morning session
  - evening session
*/
const day = (isOpen = true) => ({
  isOpen: {
    type: Boolean,
    default: isOpen,
  },

  morning: session("06:00", "08:30"),

  evening: session("14:00", "23:00"),
});

const settingsSchema = new mongoose.Schema(
  {
    /* ================= GENERAL ================= */

    general: {
      gymName: {
        type: String,
        default: "GymMaster Pro",
        trim: true,
      },

      tagline: {
        type: String,
        default: "Your partner in fitness management",
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      address: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        default: "",
        trim: true,
      },

      currency: {
        type: String,
        enum: ["PKR", "USD", "AED", "SAR", "GBP"],
        default: "PKR",
      },

      timezone: {
        type: String,
        default: "Asia/Karachi",
      },
    },

    /* ================= BUSINESS HOURS ================= */

    businessHours: {
      monday: day(true),
      tuesday: day(true),
      wednesday: day(true),
      thursday: day(true),
      friday: day(true),
      saturday: day(true),
      sunday: day(false),
    },

    /* ================= MEMBERSHIP ================= */

    membership: {
      joiningFee: {
        type: Number,
        default: 0,
        min: 0,
      },

      gracePeriodDays: {
        type: Number,
        default: 3,
        min: 0,
        max: 30,
      },

      lateFee: {
        type: Number,
        default: 0,
        min: 0,
      },

      allowFreeze: {
        type: Boolean,
        default: true,
      },

      maxFreezeDays: {
        type: Number,
        default: 30,
        min: 0,
        max: 365,
      },

      autoExpire: {
        type: Boolean,
        default: true,
      },
    },

    /* ================= NOTIFICATIONS ================= */

    notifications: {
      newMemberAlert: {
        type: Boolean,
        default: true,
      },

      paymentAlert: {
        type: Boolean,
        default: true,
      },

      expiryReminder: {
        type: Boolean,
        default: true,
      },

      expiryReminderDays: {
        type: Number,
        default: 7,
        min: 1,
        max: 60,
      },
    },

    /* ================= PAYMENT ================= */

    payment: {
      methods: {
        type: [String],
        enum: [
          "cash",
          "jazzcash",
          "easypaisa",
          "bank_transfer",
          "card",
        ],
        default: ["cash"],
      },

      taxPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      invoicePrefix: {
        type: String,
        default: "INV",
        trim: true,
        uppercase: true,
        maxlength: 10,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);