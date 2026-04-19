const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String,

    images: {
      type: [String],
      default: [],
    },

    sizes: {
      type: [String],
      default: [],
    },

    // ⭐ STOCK PER SIZE
    stock: {
      type: Map,
      of: Number,
      default: {}, // example: { s: 10, m: 5, l: 0 }
    },

    // ⭐ Manual override
    isOutOfStock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
