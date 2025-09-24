const express = require("express")
const { body, validationResult } = require("express-validator")
const Order = require("../models/Order")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.product", "name images")

    const total = await Order.countDocuments({ user: req.user._id })

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
      },
    })
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name images")
      .populate("user", "name email")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(order)
  } catch (error) {
    console.error("Get order error:", error)
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
  "/",
  auth,
  [
    body("shippingAddress.name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    body("shippingAddress.street").trim().isLength({ min: 1 }).withMessage("Street address is required"),
    body("shippingAddress.city").trim().isLength({ min: 1 }).withMessage("City is required"),
    body("shippingAddress.state").trim().isLength({ min: 1 }).withMessage("State is required"),
    body("shippingAddress.zipCode").trim().isLength({ min: 1 }).withMessage("Zip code is required"),
    body("shippingAddress.phone").trim().isLength({ min: 1 }).withMessage("Phone number is required"),
    body("paymentMethod")
      .isIn(["credit_card", "debit_card", "paypal", "cash_on_delivery"])
      .withMessage("Invalid payment method"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      // Get user's cart
      const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price images stock")

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" })
      }

      // Validate stock availability
      for (const item of cart.items) {
        if (!item.product || !item.product.isActive) {
          return res.status(400).json({
            message: `Product ${item.product?.name || "Unknown"} is no longer available`,
          })
        }

        if (item.product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available`,
          })
        }
      }

      // Calculate totals
      const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
      const tax = subtotal * 0.08 // 8% tax
      const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
      const total = subtotal + tax + shipping

      // Create order items
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0]?.url || "",
        price: item.price,
        quantity: item.quantity,
      }))

      // Create order
      const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
        notes: req.body.notes || "",
      })

      await order.save()

      // Update product stock
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })
      }

      // Clear cart
      cart.clearCart()
      await cart.save()

      res.status(201).json({
        message: "Order placed successfully",
        order,
      })
    } catch (error) {
      console.error("Create order error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private (Admin)
router.put(
  "/:id/status",
  [auth, adminAuth],
  [
    body("status")
      .isIn(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])
      .withMessage("Invalid order status"),
    body("trackingNumber").optional().trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { status, trackingNumber } = req.body
      const updateData = { orderStatus: status }

      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber
      }

      if (status === "delivered") {
        updateData.deliveredAt = new Date()
      }

      if (status === "shipped" && !trackingNumber) {
        return res.status(400).json({ message: "Tracking number is required when marking as shipped" })
      }

      const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true })

      if (!order) {
        return res.status(404).json({ message: "Order not found" })
      }

      res.json({
        message: "Order status updated successfully",
        order,
      })
    } catch (error) {
      console.error("Update order status error:", error)
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Order not found" })
      }
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private (Admin)
router.get("/admin/all", [auth, adminAuth], async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) {
      filter.orderStatus = req.query.status
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Order.countDocuments(filter)

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
      },
    })
  } catch (error) {
    console.error("Get all orders error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
