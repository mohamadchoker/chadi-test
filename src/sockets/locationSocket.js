const jwt = require("jsonwebtoken")
const { User } = require("../models")
const { UserService } = require("../services/UserService")

const userService = new UserService()

// Socket.IO authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error("Authentication error"))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.userId)

    if (!user) {
      return next(new Error("User not found"))
    }

    socket.userId = user.id
    socket.user = user
    next()
  } catch (error) {
    next(new Error("Authentication error"))
  }
}

// Setup Socket.IO event handlers
const setupSocketHandlers = (io) => {
  // Authentication middleware for all socket connections
  io.use(authenticateSocket)

  io.on("connection", async (socket) => {
    console.log(`User ${socket.user.username} connected`)

    // Update user online status
    await userService.updateOnlineStatus(socket.userId, true)

    // Join user to their own room for private messages
    socket.join(`user_${socket.userId}`)

    // Broadcast user online status to all clients
    socket.broadcast.emit("userOnline", {
      userId: socket.userId,
      username: socket.user.username,
      isOnline: true,
    })

    // Handle location sharing toggle
    socket.on("toggleLocationSharing", async (data) => {
      try {
        const { isLocationVisible } = data
        await userService.toggleLocationVisibility(socket.userId, isLocationVisible)

        // Notify all clients about visibility change
        io.emit("locationVisibilityChanged", {
          userId: socket.userId,
          isLocationVisible,
        })
      } catch (error) {
        socket.emit("error", { message: error.message })
      }
    })

    // Handle real-time location updates
    socket.on("locationUpdate", (data) => {
      const { latitude, longitude, accuracy } = data

      // Broadcast location update to all connected clients
      socket.broadcast.emit("locationUpdate", {
        userId: socket.userId,
        username: socket.user.username,
        latitude,
        longitude,
        accuracy,
        timestamp: new Date(),
      })
    })

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`User ${socket.user.username} disconnected`)

      // Update user offline status
      await userService.updateOnlineStatus(socket.userId, false)

      // Broadcast user offline status
      socket.broadcast.emit("userOffline", {
        userId: socket.userId,
        username: socket.user.username,
        isOnline: false,
      })
    })

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error)
    })
  })
}

module.exports = { setupSocketHandlers }
