require("dotenv").config();
const mongoose = require("mongoose");
const Branch = require("./models/Branch");
const Plan = require("./models/Plan");

// Apne gym ke hisab se naam, address aur qeematein yahan badal lo
const branches = [
  { name: "Comertial RawalPindi", city: "", address: "", phone: "" },
  { name: "PWD Rawalpindi", city: "", address: "", phone: "" },
  { name: "Blue Aria islamabad", city: "", address: "", phone: "" },
];

const plans = [
  { name: "Monthly", price: 6000, durationDays: 30, description: "1 month access" },
  { name: "Quarterly", price: 15000, durationDays: 90, description: "3 months access" },
  { name: "Annual", price: 45000, durationDays: 365, description: "12 months access" },
  { name: "Student", price: 4000, durationDays: 30, description: "Monthly plan for students" },
];

async function seedGym() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    // upsert + $setOnInsert: pehle se hai to kuch nahi badalta
    for (const b of branches) {
      await Branch.updateOne({ name: b.name }, { $setOnInsert: b }, { upsert: true });
    }
    for (const p of plans) {
      await Plan.updateOne({ name: p.name }, { $setOnInsert: p }, { upsert: true });
    }

    console.log(`Branches: ${await Branch.countDocuments()}, Plans: ${await Plan.countDocuments()}`);
  } catch (err) {
    console.log("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedGym();