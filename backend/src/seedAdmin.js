require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    // Pehle check karo ke admin pehle se to nahi hai
    const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) {
      console.log("Admin already exists");
      return;
    }

    await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin created:", process.env.ADMIN_EMAIL);
  } catch (err) {
    console.log("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();