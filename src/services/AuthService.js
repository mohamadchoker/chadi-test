const jwt = require("jsonwebtoken")
const { User } = require("../models")
const { Op } = require("sequelize")

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "24h" })
  }

  // Register new user
  async register(userData) {
    const { username, email, password, firstName, lastName } = userData

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists")
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    })

    // Generate token
    const token = this.generateToken(user.id)

    return {
      token,
      user: user.getPublicProfile(),
    }
  }

  // Login user
  async login(email, password) {
    // Find user by email
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Check password
    const isPasswordValid = await user.checkPassword(password)

    if (!isPasswordValid) {
      throw new Error("Invalid email or password")
    }

    // Update user online status
    await user.update({
      isOnline: true,
      lastSeen: new Date(),
    })

    // Generate token
    const token = this.generateToken(user.id)

    return {
      token,
      user: user.getPublicProfile(),
    }
  }
}

module.exports = { AuthService }
