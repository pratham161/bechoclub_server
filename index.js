const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); 
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
     mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.MONGO);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


// const authRoute = require("./routes/auth");
const authRoute = require("./routes/authentication");
const userRoute = require("./routes/user");
const addresRoute = require("./routes/addres");
const listingRoute = require("./routes/listing");

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/addres", addresRoute);
app.use("/listings", listingRoute);
connectDB().then(()=>{
    app.listen(4000,()=>console.log("server is running"));  
});