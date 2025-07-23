const { UserService } = require("../services/UserService")

class UserController {
  constructor() {
    this.userService = new UserService()
  }

  // Get user profile
  getProfile = async (req, res, next) => {
    try {
      const userId = req.user.id
      const profile = await this.userService.getUserProfile(userId)

      res.status(200).json({
        success: true,
        data: profile,
      })
    } catch (error) {
      next(error)
    }
  }

  // Update user profile
  updateProfile = async (req, res, next) => {
    try {
      const userId = req.user.id
      const updateData = req.body
      const updatedProfile = await this.userService.updateProfile(userId, updateData)

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      })
    } catch (error) {
      next(error)
    }
  }

  // Toggle location visibility
  toggleLocationVisibility = async (req, res, next) => {
    try {
      const userId = req.user.id
      const { isLocationVisible } = req.body

      const updatedUser = await this.userService.toggleLocationVisibility(userId, isLocationVisible)

      res.status(200).json({
        success: true,
        message: "Location visibility updated",
        data: { isLocationVisible: updatedUser.isLocationVisible },
      })
    } catch (error) {
      next(error)
    }
  }

  // Get online users
  getOnlineUsers = async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      const onlineUsers = await this.userService.getOnlineUsers(currentUserId)

      res.status(200).json({
        success: true,
        data: onlineUsers,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { UserController }
