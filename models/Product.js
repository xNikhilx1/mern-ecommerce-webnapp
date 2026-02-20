const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    rating: {
      type: Number,
      default: 4,
    },

    stock: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
