const router = require("express").Router();

const {signup, verify, setPassword, login, forgotPassword, resetPassword} = require("../controllers/authController");

router.post("/signup",signup);

router.put("/verify", verify);

router.put("/set-password", setPassword);

router.post("/login", login);

router.post("/forgot-password",forgotPassword);

router.put("/reset-password", resetPassword);


module.exports = router;