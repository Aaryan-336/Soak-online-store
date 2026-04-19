const router = require("express").Router();
const Email = require("../services/emailService");

/* USER LOGIN */
router.post("/login", async (req, res) => {
  const { email, name } = req.body;
  const result = await Email.sendLoginEmail(email, name);
  res.json(result);
});

/* USER SIGNUP */
router.post("/signup", async (req, res) => {
  const { email, name } = req.body;
  const result = await Email.sendSignupEmail(email, name);
  res.json(result);
});

/* ORDER CONFIRMATION */
router.post("/order-confirm", async (req, res) => {
  const { email, orderId, amount } = req.body;
  const result = await Email.sendOrderConfirmation(email, orderId, amount);
  res.json(result);
});

/* ORDER SHIPPED */
router.post("/order-shipped", async (req, res) => {
  const { email, orderId, trackingId } = req.body;
  const result = await Email.sendOrderShipped(email, orderId, trackingId);
  res.json(result);
});

/* ORDER DELIVERED */
router.post("/order-delivered", async (req, res) => {
  const { email, orderId } = req.body;
  const result = await Email.sendOrderDelivered(email, orderId);
  res.json(result);
});

/* PASSWORD RESET */
router.post("/password-reset", async (req, res) => {
  const { email, link } = req.body;
  const result = await Email.sendPasswordResetLink(email, link);
  res.json(result);
});

/* LOW STOCK ALERT */
router.post("/low-stock", async (req, res) => {
  const { email, productName, left } = req.body;
  const result = await Email.sendLowStockAlert(email, productName, left);
  res.json(result);
});

module.exports = router;
