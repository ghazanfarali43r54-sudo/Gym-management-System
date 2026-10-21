require("dotenv").config();
const app = require("./app")
const connectDB = require("./config/db")



connectDB()



app.listen(3001, ()=>{
  console.log("server running on http://localhost:3001");
})
