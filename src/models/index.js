const { Sequelize } = require("sequelize")
const config = require("../config/database")

const env = process.env.NODE_ENV || "development"
const dbConfig = config[env]

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  pool: dbConfig.pool,
})

// Import models
const User = require("./User")(sequelize)
const Location = require("./Location")(sequelize)
const LocationHistory = require("./LocationHistory")(sequelize)

// Define associations
User.hasMany(Location, { foreignKey: "userId", as: "locations" })
Location.belongsTo(User, { foreignKey: "userId", as: "user" })

User.hasMany(LocationHistory, { foreignKey: "userId", as: "locationHistory" })
LocationHistory.belongsTo(User, { foreignKey: "userId", as: "user" })

module.exports = {
  sequelize,
  User,
  Location,
  LocationHistory,
}
