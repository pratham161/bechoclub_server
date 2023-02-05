const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const connectToDb = require("./db");
connectToDb();
app.use(express.json());
app.use(cors());



// const authRoute = require("./routes/auth");
const authRoute = require("./routes/authentication");
const userRoute = require("./routes/user");

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.listen(4000,()=>console.log("server is running"));  