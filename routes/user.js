const router = require("express").Router();
const { verifyUser } = require("../middlewares/verifyToken");
const { generateOtp, kyc } = require("../controllers/userController");


router.post("/generateotp", verifyUser, generateOtp);

router.put("/kyc", verifyUser, kyc);

module.exports = router;