const router = require("express").Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// -------------------------------
// Razorpay Instance
// -------------------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------------------------------
// Create Order (Before Payment)
// -------------------------------
router.post("/create", auth, async (req, res) => {
  try {
    const { items, amount, address, phone, email } = req.body;

    // Razorpay order creation
    const rpOrder = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "SOAK_" + Date.now(),
    });

    // Store order in DB with status = "Processing"
    const newOrder = await Order.create({
      userId: req.user.id,
      items,
      amount,
      address,
      phone,
      email,
      status: "Processing",
      razorpayOrderId: rpOrder.id,
    });

    res.json({
      id: rpOrder.id,
      amount: rpOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
      currency: rpOrder.currency,
      dbOrderId: newOrder._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// -------------------------------
// Verify Payment After Checkout
// -------------------------------
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    await Order.findByIdAndUpdate(orderId, {
      status: "Processing", // payment succeeded
      razorpayPaymentId: razorpay_payment_id,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// -------------------------------
// Get Single Order (User Only)
// -------------------------------
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Error loading order" });
  }
});

// -------------------------------
// Get All Orders for Logged-in User
// -------------------------------
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

// -------------------------------
// ADMIN: Update Order Status
// -------------------------------
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    await Order.findByIdAndUpdate(req.params.id, { status });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// -------------------------------
// ADMIN: Add Tracking URL
// -------------------------------
router.put("/:id/tracking", async (req, res) => {
  try {
    const { trackingUrl } = req.body;

    await Order.findByIdAndUpdate(req.params.id, { trackingUrl });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update tracking URL" });
  }
});

const Product = require("../models/Product");

router.post("/", async (req, res) => {
  try {
    const { items, userId, address, total } = req.body;

    // Save order first
    const order = await Order.create({ items, userId, address, total });

    // Reduce stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(item.id, {
        $inc: { [`stock.${item.size}`]: -item.quantity }
      });
    }

    res.json(order);
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "Order failed" });
  }
});

module.exports = router;
