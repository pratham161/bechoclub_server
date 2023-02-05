const router = require("express").Router();
const User = require("../models/User");
const verifyUser = require("../middlewares/verifyToken");
const baseUrl = "https://1c674262-b495-47d5-a536-81a449706d35.mock.pstmn.io";

let client_id;



router.post("/generateotp", verifyUser, async (req,res)=>{

  try {
    if (req.user.isverified) {
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
    }else{
      return res.status(403).json({message:"please confirm your email"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal server error"});
  }

});



router.put("/kyc", verifyUser, async (req,res)=>{
  try {
       if (req.user.isverified) {
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
         await User.findByIdAndUpdate(req.user.id, {
           $set: {
               fullName: response.data.full_name,
               adhaar_number: response.data.aadhaar_number,
               profile_img: response.data.profile_image,
           },
         });
         //TODO:add address creation code    
         res.status(200).json({
           message:
             "KYC has been successful, now you can trade on the platform thankyou.",
           response: response,
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