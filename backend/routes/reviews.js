// routes/reviews.js
const express = require('express')
const router = express.Router()
const Product = require('../models/Product')

// POST /reviews -> { productId, name, rating, comment }
router.post('/', async (req, res) => {
  const { productId, name, rating, comment } = req.body
  const prod = await Product.findById(productId)
  if (!prod) return res.status(404).json({ error: 'product not found' })
  prod.reviews = prod.reviews || []
  prod.reviews.push({ name, rating, comment, photos: photos || [], createdAt: new Date() })
  await prod.save()
  res.json({ ok: true })
})

module.exports = router
