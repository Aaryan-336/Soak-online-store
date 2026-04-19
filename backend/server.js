const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json()); // MUST come before routes

// ---------------------------------------------
// CONNECT MONGODB
// ---------------------------------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// ---------------------------------------------
// IMPORT ROUTES
// ---------------------------------------------
const productRouter = require("./routes/products");
const uploadRouter = require("./routes/upload");
const orderRouter = require("./routes/orders");
const analyticsRouter = require("./routes/analytics");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const emailRouter = require("./routes/email"); // NEW route

// ---------------------------------------------
// USE ROUTES (Order matters but this is correct)
// ---------------------------------------------
app.use("/email", emailRouter);
app.use("/products", productRouter);
app.use("/upload", uploadRouter);
app.use("/orders", orderRouter);
app.use("/analytics", analyticsRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/system-emails", require("./routes/systemEmails"));


// ---------------------------------------------
// START SERVER
// ---------------------------------------------
const port = process.env.PORT || 4000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Backend running on http://0.0.0.0:${port}`);
  });
  