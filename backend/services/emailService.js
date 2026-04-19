const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ----------------------------------------------
   GENERIC SEND EMAIL FUNCTION
------------------------------------------------*/
async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"SOAK Clothing" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (err) {
    console.error("EMAIL ERROR:", err.message);
    return { success: false, error: err.message };
  }
}

/* ----------------------------------------------
   EMAIL TEMPLATES
------------------------------------------------*/

exports.sendLoginEmail = (email, name) =>
  sendEmail(
    email,
    "Login Successful ✔",
    `
    <h2>Welcome back, ${name || "user"}!</h2>
    <p>You have successfully logged into your SOAK account.</p>
    `
  );

exports.sendSignupEmail = (email, name) =>
  sendEmail(
    email,
    "Welcome to SOAK 🎉",
    `
    <h2>Hello ${name || "there"}!</h2>
    <p>Thank you for creating an account with SOAN.</p>
    <p>Enjoy exclusive old-money style fashion curated for you.</p>
    `
  );

exports.sendOrderConfirmation = (email, orderId, amount) =>
  sendEmail(
    email,
    "Your Order Has Been Placed 🛍️",
    `
    <h2>Order Confirmed!</h2>
    <p>Your order <b>#${orderId}</b> has been successfully placed.</p>
    <p>Total Amount: <b>₹${amount}</b></p>
    <p>Thank you for shopping with SOAK.</p>
    `
  );

exports.sendOrderShipped = (email, orderId, trackingId) =>
  sendEmail(
    email,
    "Your Order is on its Way 🚚",
    `
    <h2>Good news!</h2>
    <p>Your order <b>#${orderId}</b> has been shipped.</p>
    <p>Tracking ID: <b>${trackingId}</b></p>
    `
  );

exports.sendOrderDelivered = (email, orderId) =>
  sendEmail(
    email,
    "Order Delivered 📦",
    `
    <h2>Your order has been delivered!</h2>
    <p>Order ID: <b>${orderId}</b></p>
    <p>Enjoy your premium SOAK outfit!</p>
    `
  );

exports.sendPasswordResetLink = (email, resetLink) =>
  sendEmail(
    email,
    "Reset Your SOAK Password 🔐",
    `
    <h2>Password Reset Requested</h2>
    <p>Click below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    `
  );

exports.sendLowStockAlert = (adminEmail, productName, left) =>
  sendEmail(
    adminEmail,
    "⚠️ Low Stock Alert",
    `
    <h2>Low Stock Warning</h2>
    <p>Product: <b>${productName}</b></p>
    <p>Only <b>${left}</b> items left in inventory.</p>
    `
  );
