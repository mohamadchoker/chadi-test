const { AuthService } = require("../services/AuthService")

class AuthController {
  constructor() {
    this.authService = new AuthService()
  }

  // User registration
  register = async (req, res, next) => {
    try {
      const userData = req.body
      const result = await this.authService.register(userData)

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  // User login
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const result = await this.authService.login(email, password)

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  // User logout
  logout = async (req, res, next) => {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success message
      res.status(200).json({
        success: true,
        message: "Logout successful",
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { AuthController }
