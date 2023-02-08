const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    images: {
      type: Array,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
    },
  },
  { timestamsps: true }
);

const Product = mongoose.model("product",productSchema);

module.exports = Product;