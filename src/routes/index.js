const express = require("express")
const authRoutes = require("./authRoutes")
const userRoutes = require("./userRoutes")
const locationRoutes = require("./locationRoutes")

const router = express.Router()

// Route definitions
router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/locations", locationRoutes)

module.exports = router
