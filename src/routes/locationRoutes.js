const express = require("express")
const { LocationController } = require("../controllers/LocationController")
const { authenticateToken } = require("../middleware/auth")
const { validateLocationUpdate } = require("../middleware/validation")

const router = express.Router()
const locationController = new LocationController()

// Location routes - all require authentication
router.use(authenticateToken)

router.post("/update", validateLocationUpdate, locationController.updateLocation)
router.get("/current/:userId?", locationController.getCurrentLocation)
router.get("/history/:userId?", locationController.getLocationHistory)
router.get("/visible-users", locationController.getVisibleUsers)

module.exports = router
