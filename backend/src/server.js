require("dotenv").config();
const connectDB = require("./config/db")
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const settingsRoutes = require("./routes/settingsRoutes"); 
const publicRoutes = require("./routes/publicRoutes"); 
const adminRequestRoutes = require("./routes/adminRequestRoutes"); 
const adminTrainerRoutes = require("./routes/adminTrainerRoutes");
const membershipPlanRoutes = require("./routes/membershipPlan");
const features = require("./routes/features");
const bodyMeasurementRoutes = require("./routes/bodyMeasurementRoutes");
const fitnessAssessmentRoutes = require("./routes/fitnessAssessmentRoutes");


const app = express();

app.use(cors({origin: "http://localhost:3000",credentials: true,}));
app.use(express.json({ limit: "200kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/public", publicRoutes);  
app.use("/api/admin/requests", adminRequestRoutes); 
app.use("/api/admin/trainers", adminTrainerRoutes); 
app.use("/api/membership-plans", membershipPlanRoutes);
app.use("/api/features", features);
app.use("/api/body-measurements", bodyMeasurementRoutes);
app.use("/api/fitness-assessments", fitnessAssessmentRoutes);


const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start API:", error.message);
    process.exitCode = 1;
  }
}

startServer();
