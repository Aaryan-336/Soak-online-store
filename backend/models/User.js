const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: String, // hashed password
  provider: { type: String, default: "email" }, // email | google
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
