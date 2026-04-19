const router = require("express").Router();
const nodemailer = require("nodemailer");

// SAFE email endpoint
router.post("/login-success", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Transporter with fail-safe error handling
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construct the email
    const mailOptions = {
      from: `"SOAK Clothing" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Login Successful ✔",
      html: `
        <h2>Hello ${name || "User"},</h2>
        <p>You have successfully logged in to <strong>SOAK</strong>.</p>
        <p>If this wasn't you, please secure your account immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });

  } catch (err) {
    console.error("EMAIL SEND ERROR:", err.message);

    // Respond safely, don't crash server
    res.status(500).json({ error: "Could not send email", details: err.message });
  }
});

module.exports = router;
