const express = require("express")
const { AuthController } = require("../controllers/AuthController")
const { validateRegistration, validateLogin } = require("../middleware/validation")

const router = express.Router()
const authController = new AuthController()

// Authentication routes
router.post("/register", validateRegistration, authController.register)
router.post("/login", validateLogin, authController.login)
router.post("/logout", authController.logout)

module.exports = router
