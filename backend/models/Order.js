const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // 🔗 Link order to the user who placed it
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // allow guest orders too
    },

    // 🛍 Items in the order (productId, quantity, size, etc.)
    items: [
      {
        productId: { type: String, required: true },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        image: String,
      },
    ],

    // 💰 Total amount charged
    amount: {
      type: Number,
      required: true,
    },

    // 📦 Shipping details
    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    // 🚚 Order status
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Processing",
    },

    // 🔗 Optional tracking link (Shiprocket, Delhivery, etc.)
    trackingUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // automatically adds createdAt + updatedAt
  }
);

module.exports = mongoose.model("Order", OrderSchema);
