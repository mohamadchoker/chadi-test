const { LocationService } = require("../services/LocationService")

class LocationController {
  constructor() {
    this.locationService = new LocationService()
  }

  // Update user location
  updateLocation = async (req, res, next) => {
    try {
      const userId = req.user.id
      const { latitude, longitude, accuracy } = req.body
      

      const location = await this.locationService.updateLocation(userId, {
        latitude,
        longitude,
        accuracy,
      })

      // Emit real-time location update via Socket.IO to all connected clients
      // This fulfills the requirement for instant location updates
      if (req.io) {
        req.io.emit("locationUpdate", {
          userId,
          latitude,
          longitude,
          timestamp: location.timestamp,
          user: req.user.getPublicProfile(),
        })
      }

      res.status(200).json({
        success: true,
        message: "Location updated successfully",
        data: location,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get current location
  getCurrentLocation = async (req, res, next) => {
    try {
      const requestedUserId = req.params.userId
      const currentUserId = req.user.id

      // If no userId provided, get current user's location
      const userId = requestedUserId || currentUserId

      const location = await this.locationService.getCurrentLocation(userId, currentUserId)

      res.status(200).json({
        success: true,
        data: location,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get location history
  getLocationHistory = async (req, res, next) => {
    try {
      const requestedUserId = req.params.userId
      const currentUserId = req.user.id
      const { limit = 50, offset = 0 } = req.query

      // If no userId provided, get current user's history
      const userId = requestedUserId || currentUserId

      const history = await this.locationService.getLocationHistory(userId, currentUserId, {
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
      })

      res.status(200).json({
        success: true,
        data: history,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get users with visible locations
  getVisibleUsers = async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      const visibleUsers = await this.locationService.getVisibleUsers(currentUserId)

      res.status(200).json({
        success: true,
        data: visibleUsers,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { LocationController }
