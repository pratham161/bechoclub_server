const mongoose = require("mongoose");

const verificationSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expiresAt: { type: Date, expires: "600s", default: Date.now },
});

const Verification = mongoose.model("verification",verificationSchema);

module.exports = Verification;