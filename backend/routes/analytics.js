// routes/analytics.js
const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const Product = require('../models/Product')
const mongoose = require('mongoose')

// GET /analytics  (admin only)
router.get('/', async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'unauthorized' })

  try {
    // total sales and orders
    const totalAgg = await Order.aggregate([
      { $match: { status: { $in: ['paid','shipped','delivered'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' }, totalOrders: { $sum: 1 } } }
    ])

    const totalRevenue = totalAgg[0]?.totalRevenue || 0
    const totalOrders = totalAgg[0]?.totalOrders || 0

    // sales last 7 days
    const sevenDays = new Date()
    sevenDays.setDate(sevenDays.getDate() - 6) // include today
    const salesByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(sevenDays) }, status: { $in: ['paid','shipped','delivered'] } } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          dayRevenue: { $sum: '$amount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // top products by qty
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', qtySold: { $sum: '$items.qty' } } },
      { $sort: { qtySold: -1 } },
      { $limit: 8 }
    ])
    // populate product names
    const topWithDetails = await Promise.all(
      topProducts.map(async (t) => {
        const prod = await Product.findById(t._id).select('name images')
        return { productId: t._id, qtySold: t.qtySold, name: prod?.name || 'Deleted', image: prod?.images?.[0] || null }
      })
    )

    res.json({
      totalRevenue,
      totalOrders,
      salesByDay,
      topProducts: topWithDetails
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'analytics_error' })
  }
})

module.exports = router
