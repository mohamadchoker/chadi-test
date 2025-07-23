const { Location, LocationHistory, User } = require("../models")
const { Op } = require("sequelize")

class LocationService {
  // Update user location
  async updateLocation(userId, locationData) {
    const { latitude, longitude, accuracy } = locationData

      
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error("Invalid location coordinates")
    }
  

    // Update or create current location
    const [location] = await Location.upsert({
      userId,
      latitude,
      longitude,
      accuracy,
      timestamp: new Date(),
    })

    // Save to location history
    await LocationHistory.create({
      userId,
      latitude,
      longitude,
      accuracy,
      timestamp: new Date(),
    })

    return location
  }

  // Get current location for a user
  async getCurrentLocation(userId, requestingUserId) {
    // Check if requesting user has permission to view this location
    if (userId !== requestingUserId) {
      const targetUser = await User.findByPk(userId)

      if (!targetUser || !targetUser.isLocationVisible) {
        throw new Error("Location not accessible")
      }
    }

    const location = await Location.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
      order: [["timestamp", "DESC"]],
    })

    return location
  }

  // Get location history for a user
  async getLocationHistory(userId, requestingUserId, options = {}) {
    const { limit = 50, offset = 0 } = options

    // Check if requesting user has permission to view this history
    if (userId !== requestingUserId) {
      const targetUser = await User.findByPk(userId)

      if (!targetUser || !targetUser.isLocationVisible) {
        throw new Error("Location history not accessible")
      }
    }

    // Get history from last 24 hours with 20-second intervals
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const history = await LocationHistory.findAll({
      where: {
        userId,
        timestamp: {
          [Op.gte]: twentyFourHoursAgo,
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
      order: [["timestamp", "DESC"]],
      limit,
      offset,
    })

    // Filter to ensure 20-second intervals
    const filteredHistory = this.filterLocationsByInterval(history, 20)

    return filteredHistory
  }

  // Get users with visible locations
  async getVisibleUsers(currentUserId) {
    const users = await User.findAll({
      where: {
        isLocationVisible: true,
        id: { [Op.ne]: currentUserId },
      },
      include: [
        {
          model: Location,
          as: "locations",
          limit: 1,
          order: [["timestamp", "DESC"]],
          required: false,
        },
      ],
      attributes: ["id", "username", "firstName", "lastName", "isOnline", "lastSeen"],
    })

    return users
  }

  filterLocationsByInterval(locations, intervalSeconds) {
    if (locations.length === 0) return locations

    const filtered = [locations[0]] // Always include the first location
    let lastTimestamp = new Date(locations[0].timestamp)

    for (let i = 1; i < locations.length; i++) {
      const currentTimestamp = new Date(locations[i].timestamp)
      const timeDiff = (lastTimestamp - currentTimestamp) / 1000 // difference in seconds

      if (timeDiff >= intervalSeconds) {
        filtered.push(locations[i])
        lastTimestamp = currentTimestamp
      }
    }

    return filtered
  }
}

module.exports = { LocationService }
