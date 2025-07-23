const jwt = require("jsonwebtoken")
const { User } = require("../models")

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const user = await User.findByPk(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    // Add user to request object
    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
}

module.exports = { authenticateToken }
