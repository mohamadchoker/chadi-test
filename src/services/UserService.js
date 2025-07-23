const { User } = require("../models")

class UserService {
  // Get user profile by ID
  async getUserProfile(userId) {
    const user = await User.findByPk(userId)

    if (!user) {
      throw new Error("User not found")
    }

    return user.getPublicProfile()
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    const user = await User.findByPk(userId)

    if (!user) {
      throw new Error("User not found")
    }

    // Only allow certain fields to be updated
    const allowedFields = ["firstName", "lastName", "username"]
    const filteredData = {}

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field]
      }
    })

    await user.update(filteredData)

    return user.getPublicProfile()
  }

  // Toggle location visibility
  async toggleLocationVisibility(userId, isLocationVisible) {
    const user = await User.findByPk(userId)

    if (!user) {
      throw new Error("User not found")
    }

    await user.update({ isLocationVisible })

    return user
  }

  // Get online users (excluding current user)
  async getOnlineUsers(currentUserId) {
    const users = await User.findAll({
      where: {
        isOnline: true,
        id: { $ne: currentUserId },
      },
      attributes: ["id", "username", "firstName", "lastName", "isLocationVisible", "lastSeen"],
    })

    return users
  }

  // Update user online status
  async updateOnlineStatus(userId, isOnline) {
    const user = await User.findByPk(userId)

    if (user) {
      await user.update({
        isOnline,
        lastSeen: new Date(),
      })
    }

    return user
  }
}

module.exports = { UserService }
