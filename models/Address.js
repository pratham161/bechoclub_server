const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    details: {
      type: Object,
      default: {},
      required: true,
    },
  },
  { timestamsps: true }
);

const Address = mongoose.model("address", addressSchema);

module.exports = Address;