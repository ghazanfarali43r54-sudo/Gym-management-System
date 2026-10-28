require("dotenv").config();
const app = require("./app")
const connectDB = require("./config/db")



connectDB()



app.listen(5001, ()=>{
  console.log("server running on http://localhost:5001");
})
