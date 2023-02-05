const router = require("express").Router();
const User = require("../models/User");
const randomString = require("randomstring");
const nodemailer = require("nodemailer");
const Verification = require("../models/Verification");
const crypto  = require("crypto-js");
const jwt = require("jsonwebtoken");

const sendVerification = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: false,
      port: 587,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Alert from Bchoclub",
      html: `<p>Thankyou for choosing Bechoclub <b>${otp}</b> is your verification code for Bechoclub</p> <p> it will be valid for <b> 3 minutes</b></p>`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log(info.response);
  } catch (error) {
    console.log(error);
  }
};

const sendPasswordVerification = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: false,
      port: 587,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Alert from Bchoclub",
      html: `<p>Forgot pasword? No worries <b>${otp}</b> is your verification code for password reset </p> <p> code will be valid for <b> 3 minutes</b></p>`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log(info.response);
  } catch (error) {
    console.log(error);
  }
};



router.post("/signup",async (req,res)=>{
    try {
        let user = await User.findOne({email: req.body.email});
       if(user){
        return res.status(403).json({message:"email already exists"});
       }
       const otp = randomString.generate({
        length:4,
        charset:"numeric"
       })
      const newUser = await User.create({
        email: req.body.email,
      });
       await Verification.create({
         user: newUser._id,
         otp: otp,
       });
       await sendVerification(req.body.email, otp).catch( async (error) => {
         if (error)
          await User.findOneAndDelete({ email: req.body.email });
          await Verification.findOneAndDelete({otp:otp});
           return res
             .status(400)
             .json({ message: "plaease enter valid email" });
       });
      res.status(200).json({message:"please check for the verification code in your inbox"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
    
});

router.put("/verify", async (req,res)=>{
    try {
        let user = await Verification.findOne({ otp: req.body.otp });      
        if (!user) {
          return res.status(404).json({success:false, message: "enter valid otp" });
        }else{
          res.status(200).json({success:true});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
    
});

router.put("/set-password", async (req,res)=>{
  try {
     let verification = await Verification.findOne({ otp: req.body.otp });
     if (!verification) {
       return res.status(404).json({ message: "enter valid otp" });
     }
      const secPassword = crypto.AES.encrypt(
        req.body.password,
        process.env.USERPASSSEC
      ).toString();
      const updatedUser = await User.findByIdAndUpdate(
        verification.user,
        {
          $set: { password: secPassword, isverified:true },
        },
        { new: true }
      );
      const authToken = jwt.sign(
        { id: updatedUser._id, isverified: updatedUser.isverified },
        process.env.JWT_SECRETE
      );
      await Verification.findOneAndDelete({ otp: req.body.otp });
      res.status(200).json({token:authToken});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/login", async (req,res)=>{
   
   try {
     const user = await User.findOne({ email: req.body.email });
     if (!user) {
       return res.status(403).json({ message: "enter valid credentials" });
     }
     const bytes = crypto.AES.decrypt(user.password, process.env.USERPASSSEC);
     const password = bytes.toString(crypto.enc.Utf8);
     if (req.body.password === password) {
      const authToken = jwt.sign(
        { id: user._id, isverified: user.isverified },
        process.env.JWT_SECRETE
      );
      return res.status(200).json({token:authToken});
    } else {
       return res.status(403).json({ message: "enter valid credentials" });
     }
   } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
   }
});


router.post("/forgot-password",async (req,res)=>{
  try {
  let user = await User.findOne({email:req.body.email});
  if(!user){
    return res.status(404).json({message:"enter valid credentials"});
  } 
    const otp = randomString.generate({
      length: 4,
      charset: "numeric",
    });
    await Verification.create({
      user: user._id,
      otp: otp,
    });
    await sendPasswordVerification(req.body.email, otp)
    res
      .status(200)
      .json({ message: "please check for the verification code in your inbox" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

router.put("/reset-password", async (req,res)=>{
  try {
    let user = await Verification.findOne({ otp: req.body.otp });
    if (!user) {
      return res.status(404).json({ message: "enter valid otp" });
    }
     const secPassword = crypto.AES.encrypt(
       req.body.password,
       process.env.USERPASSSEC
     ).toString();
    const updatedUser = await User.findByIdAndUpdate(
      user.user,
      {
        $set: { password: secPassword },
      },
      { new: true }
    );
    res.status(200).json({ message: "password reset is successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});


module.exports = router;