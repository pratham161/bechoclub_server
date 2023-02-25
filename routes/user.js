const router = require("express").Router();
const User = require("../models/User");
const { verifyUser } = require("../middlewares/verifyToken");
const Address = require("../models/Address");
const jwt = require("jsonwebtoken");
const baseUrl = "https://1c674262-b495-47d5-a536-81a449706d35.mock.pstmn.io";

let client_id;

router.post("/generateotp", verifyUser, async (req, res) => {
  try {
    if (req.user.isverified && !req.user.isAdharVerified ) {
      const url = `${baseUrl}/api/v1/aadhaar-v2/generate-otp"`;
      let user = await User.findOne({ adhaar_number: req.body.adharNo });
      if (user) {
        return res.status(400).json({ message: "aadhaar already exists" });
      }

      const data = {
        id_number: req.body.adharNo,
      };

      const generateOtp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await generateOtp.json();
      client_id = response.data.client_id;
      res.status(200).json({
        success: response.data.success,
        otpSent: response.data.otp_sent,
      });
    } else {
      return res.status(403).json({ message: "please confirm your email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.put("/kyc", verifyUser, async (req, res) => {
  try {
    if ( req.user.isverified && !req.user.isAdharVerified ) {
      const url = `${baseUrl}/api/v1/aadhaar-v2/submit-otp`;
      const data = {
        client_id: client_id,
        otp: req.body.otp,
      };

      const submitOtp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await submitOtp.json();
      const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        $set: {
          fullName: response.data.full_name,
          adhaar_number: response.data.aadhaar_number,
          profile_img: response.data.profile_image,
          isAdharVerified: true,
        },
      });
      //TODO:add address creation code
      await Address.create({
        user: req.user.id,
        isPrimary: true,
        details: response.data.address,
      });
      //TODO:sign new jwt token with adhar confirmation
      const authToken = jwt.sign(
        {
          id: updatedUser._id,
          isverified: updatedUser.isverified,
          isAdharVerified: updatedUser.isAdharVerified,
        },
        process.env.JWT_SECRETE
      );
      res.status(200).json({
        message:
          "KYC has been successful, now you can trade on the platform thankyou.",
        authToken: authToken,
      });
    } else {
      return res.status(403).json({ message: "please confirm your email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;