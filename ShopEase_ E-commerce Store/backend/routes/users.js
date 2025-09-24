const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get("/", [auth, adminAuth], async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const users = await User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await User.countDocuments()

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin)
router.get("/:id", [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    if (error.name === "CastError") {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin)
router.put(
  "/:id/role",
  [auth, adminAuth],
  [body("role").isIn(["user", "admin"]).withMessage("Invalid role")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { role } = req.body

      // Prevent admin from changing their own role
      if (req.params.id === req.user._id.toString()) {
        return res.status(400).json({ message: "Cannot change your own role" })
      }

      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password")

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json({
        message: "User role updated successfully",
        user,
      })
    } catch (error) {
      console.error("Update user role error:", error)
      if (error.name === "CastError") {
        return res.status(404).json({ message: "User not found" })
      }
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete("/:id", [auth, adminAuth], async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" })
    }

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    if (error.name === "CastError") {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
