const mongoose = require("mongoose");

async function connectDB() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MONGO_URL is not set. Add it to backend/.env before starting the API.");
  }

  await mongoose.connect(mongoUrl);
  console.log("Connected to DB");
}

module.exports = connectDB;


