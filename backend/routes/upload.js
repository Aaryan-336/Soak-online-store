const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("NO FILE RECEIVED");
      return res.status(400).json({ error: "No file received" });
    }

    console.log("FILE RECEIVED:", req.file.path);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "soak_products",
    });

    fs.unlinkSync(req.file.path);

    console.log("UPLOAD SUCCESS:", result.secure_url);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.log("CLOUDINARY ERROR:", err);
    res.status(500).json({ error: "Cloudinary upload failed", details: err });
  }
});

module.exports = router;
