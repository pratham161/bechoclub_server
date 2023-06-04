const User = require("../models/User");
const randomString = require("randomstring");
const Verification = require("../models/Verification");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const {
  sendVerification,
  sendPasswordVerification,
} = require("../controllers/emailController");

exports.signup = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(403).json({ message: "email already exists" });
    }
    const otp = randomString.generate({
      length: 4,
      charset: "numeric",
    });
    const newUser = await User.create({
      email: req.body.email,
    });
    await Verification.create({
      user: newUser._id,
      otp: otp,
    });
    await sendVerification(req.body.email, otp).catch(async (error) => {
      if (error) await User.findOneAndDelete({ email: req.body.email });
      await Verification.findOneAndDelete({ otp: otp });
      return res.status(400).json({ message: "plaease enter valid email" });
    });
    res
      .status(200)
      .json({
        message: "please check for the verification code in your inbox",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.verify = async (req, res) => {
  try {
    let user = await Verification.findOne({ otp: req.body.otp });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "enter valid otp" });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.setPassword = async (req, res) => {
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
        $set: { password: secPassword, isverified: true },
      },
      { new: true }
    );
    const authToken = jwt.sign(
      {
        id: updatedUser._id,
        isverified: updatedUser.isverified,
        isAdharVerified: updatedUser.isAdharVerified,
      },
      process.env.JWT_SECRETE
    );
    await Verification.findOneAndDelete({ otp: req.body.otp });
    res.status(200).json({ token: authToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(403).json({ message: "enter valid credentials" });
    }
    const bytes = crypto.AES.decrypt(user.password, process.env.USERPASSSEC);
    const password = bytes.toString(crypto.enc.Utf8);
    if (req.body.password === password) {
      const authToken = jwt.sign(
        {
          id: user._id,
          isverified: user.isverified,
          isAdharVerified: user.isAdharVerified,
        },
        process.env.JWT_SECRETE
      );
      return res.status(200).json({ token: authToken });
    } else {
      return res.status(403).json({ message: "enter valid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.forgotPassword = async (req,res)=>{
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
};

exports.resetPassword = async (req, res) => {
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
};