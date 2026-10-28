const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
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
      select: false, // user ko dhoondte waqt password apne aap nahi aayega
    },
    role: {
      type: String,
      enum: ["admin", "trainer", "member"],
      default: "member",
    },

    // ---- member ki request ke liye ----
    // pending = admin ke jawab ka intezar, active = login kar sakta hai, rejected = request radd
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "active", // admin aur trainer pehle se active hote hain
    },
    phone: { type: String, trim: true, default: "" },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", default: null },
    photo: { type: String, default: "" }, // chhoti JPEG (base64 text)
    message: { type: String, trim: true, default: "", maxlength: 300 },
        // ---- admin ke faisle ka record ----
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    rejectReason: { type: String, trim: true, default: "", maxlength: 200 },
  },
  { timestamps: true } // createdAt aur updatedAt apne aap ban jate hain
);

// Save hone se pehle password ko hash kar do
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Login ke waqt password match karne ke liye
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);