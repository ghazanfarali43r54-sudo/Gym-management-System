const mongoose = require("mongoose");

function connectDB(){

  mongoose.connect(process.env.MONGO_URL)
  .then(()=>{
    console.log("Connected to DB")
    
  })
  .catch( err => {
    console.log("DB Connection Error:", err.message)
    process.exit(1)
  })
}

module.exports = connectDB;


