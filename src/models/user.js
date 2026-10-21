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
      enum: ["admin", "trainer"],
      default: "admin",
    },
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