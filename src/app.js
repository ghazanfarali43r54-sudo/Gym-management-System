const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const settingsRoutes = require("./routes/settingsRoutes"); 
const publicRoutes = require("./routes/publicRoutes"); 
const adminRequestRoutes = require("./routes/adminRequestRoutes"); 
const adminCatalogRoutes = require("./routes/adminCatalogRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: "200kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/public", publicRoutes);  
app.use("/api/admin/requests", adminRequestRoutes); 
app.use("/api/admin", adminCatalogRoutes);                                 

module.exports = app;