const router = require("express").Router();
const Product = require("../models/Product");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to load products" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const sizes = req.body.sizes || [];
    
    const stock = {};
    sizes.forEach((s) => {
      stock[s] = Number(req.body.stock?.[s] || 0);
    });

    const product = await Product.create({
      ...req.body,
      stock,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Product creation failed" });
  }
});

// GET SINGLE
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to load product" });
  }
});

// UPDATE PRODUCT + STOCK
router.put("/:id", async (req, res) => {
  try {
    const sizes = req.body.sizes || [];
    const stock = {};
    sizes.forEach((s) => {
      stock[s] = Number(req.body.stock?.[s] || 0);
    });

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        stock,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// OUT OF STOCK SWITCH
router.patch("/:id/outOfStock", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { isOutOfStock: req.body.isOutOfStock },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Toggle failed" });
  }
});

// STOCK DECREASE AFTER ORDER
router.patch("/:id/decrease", async (req, res) => {
  try {
    const { size, qty } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product.stock.get(size) || product.stock.get(size) < qty) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    product.stock.set(size, product.stock.get(size) - qty);
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Stock update failed" });
  }
});

module.exports = router;
