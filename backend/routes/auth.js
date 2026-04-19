const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------------------
// Generate JWT
// ---------------------------
function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ---------------------------
// SIGNUP
// ---------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      provider: "email",
      password: hash,
    });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Signup failed" });
  }
});

// ---------------------------
// LOGIN
// ---------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    if (user.provider === "google")
      return res
        .status(400)
        .json({ error: "Use Google Sign-in for this account" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = createToken(user);

    return res.json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// ---------------------------
// GOOGLE LOGIN
// ---------------------------
router.post("/google", async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    // If first time, register automatically
    if (!user) {
      user = await User.create({
        name,
        email,
        provider: "google",
      });
    }

    const token = createToken(user);

    return res.json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Google login failed" });
  }
});

module.exports = router;
