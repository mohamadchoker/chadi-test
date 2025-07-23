const express = require("express")
const { UserController } = require("../controllers/UserController")
const { authenticateToken } = require("../middleware/auth")
const { validateProfileUpdate } = require("../middleware/validation")

const router = express.Router()
const userController = new UserController()

// User routes - all require authentication
router.use(authenticateToken)

router.get("/profile", userController.getProfile)
router.put("/profile", validateProfileUpdate, userController.updateProfile)
router.put("/location-visibility", userController.toggleLocationVisibility)
router.get("/online-users", userController.getOnlineUsers)

module.exports = router
