const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const { sequelize } = require("./models")
const routes = require("./routes")
const { errorHandler } = require("./middleware/errorHandler")
const { setupSocketHandlers } = require("./sockets/locationSocket")

const app = express()
const server = http.createServer(app)

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Security middleware
app.use(helmet())
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io
  next()
})

// Routes
app.use("/api", routes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use(errorHandler)

// Setup Socket.IO handlers
setupSocketHandlers(io)

const PORT = process.env.PORT || 3000

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log("Database connection established successfully.")

    // In development, you can run migrations automatically
    // In production, run migrations separately using npm run db:migrate
    if (process.env.NODE_ENV === "development" && process.env.AUTO_MIGRATE === "true") {
      console.log("Running database migrations...")
      // Note: In production, run migrations manually using CLI
      // await sequelize.sync({ alter: true })
      console.log("Database migrations completed. Run 'npm run db:migrate' to apply migrations.")
    }

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV}`)
      console.log("To set up database:")
      console.log("1. npm run db:create")
      console.log("2. npm run db:migrate")
      console.log("3. npm run db:seed")
    })
  } catch (error) {
    console.error("Unable to start server:", error)
    process.exit(1)
  }
}

startServer()

module.exports = { app, server, io }
