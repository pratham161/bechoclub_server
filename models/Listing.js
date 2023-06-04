const mongoose = require("mongoose");

const listingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    intialPrice: {
      type: String,
      required: true,
    },
    finalPrice: {
      type: String,
    },
    desc: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: [],
      required: true,
      maxLength: 4,
    },
    seller: {
      type: String,
      required: true,
    },
    buyer: {
      type: String,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    shippingInfo: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;