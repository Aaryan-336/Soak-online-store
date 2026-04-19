const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Order = require("../models/Order");

// Get profile + orders
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ user, orders });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch profile" });
  }
});

// Update profile
router.put("/update", auth, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Could not update profile" });
  }
});

module.exports = router;
