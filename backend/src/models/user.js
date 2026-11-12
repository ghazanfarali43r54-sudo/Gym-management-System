const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// Address Schema reusable schema can be used with member and trainer model
const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

// Emergency Contact Schema reusable schema can be used with member and trainer model
const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    relationship: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

 

const userSchema = new mongoose.Schema(
  {
    // Basic information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    // Contact information
    phone: {
      type: String,
      trim: true,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "trainer", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "inactive"],
      default: "active",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "",
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password during login
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};
const User = mongoose.models.User || mongoose.model("User", userSchema);

// module.exports = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = {
  User,
  addressSchema,
  emergencyContactSchema,
};
