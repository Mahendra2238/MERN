const express = require("express")
const { body, validationResult } = require("express-validator")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const { auth } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price images stock isActive")

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
      await cart.save()
    }

    // Filter out inactive products
    cart.items = cart.items.filter((item) => item.product && item.product.isActive)
    await cart.save()

    res.json(cart)
  } catch (error) {
    console.error("Get cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post(
  "/",
  auth,
  [
    body("productId").isMongoId().withMessage("Invalid product ID"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
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

      const { productId, quantity } = req.body

      // Check if product exists and is active
      const product = await Product.findById(productId)
      if (!product || !product.isActive) {
        return res.status(404).json({ message: "Product not found" })
      }

      // Check stock availability
      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`,
        })
      }

      // Get or create cart
      let cart = await Cart.findOne({ user: req.user._id })
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] })
      }

      // Check if item already exists in cart
      const existingItem = cart.items.find((item) => item.product.toString() === productId)

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        if (product.stock < newQuantity) {
          return res.status(400).json({
            message: `Only ${product.stock} items available in stock`,
          })
        }
        existingItem.quantity = newQuantity
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        })
      }

      await cart.save()
      await cart.populate("items.product", "name price images stock isActive")

      res.json({
        message: "Item added to cart successfully",
        cart,
      })
    } catch (error) {
      console.error("Add to cart error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   PUT /api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put(
  "/:itemId",
  auth,
  [body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { quantity } = req.body
      const cart = await Cart.findOne({ user: req.user._id })

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" })
      }

      const item = cart.items.id(req.params.itemId)
      if (!item) {
        return res.status(404).json({ message: "Item not found in cart" })
      }

      // Check stock availability
      const product = await Product.findById(item.product)
      if (!product || !product.isActive) {
        return res.status(404).json({ message: "Product not found" })
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`,
        })
      }

      item.quantity = quantity
      await cart.save()
      await cart.populate("items.product", "name price images stock isActive")

      res.json({
        message: "Cart updated successfully",
        cart,
      })
    } catch (error) {
      console.error("Update cart error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete("/:itemId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const item = cart.items.id(req.params.itemId)
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" })
    }

    cart.items.pull(req.params.itemId)
    await cart.save()
    await cart.populate("items.product", "name price images stock isActive")

    res.json({
      message: "Item removed from cart successfully",
      cart,
    })
  } catch (error) {
    console.error("Remove from cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.clearCart()
    await cart.save()

    res.json({
      message: "Cart cleared successfully",
      cart,
    })
  } catch (error) {
    console.error("Clear cart error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
