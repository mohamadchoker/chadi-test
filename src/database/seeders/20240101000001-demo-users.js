const bcrypt = require("bcryptjs")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash passwords for demo users
    const hashedPassword = await bcrypt.hash("password123", 12)

    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "john_doe",
          email: "john.doe@example.com",
          password: hashedPassword,
          firstName: "John",
          lastName: "Doe",
          isLocationVisible: true,
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "jane_smith",
          email: "jane.smith@example.com",
          password: hashedPassword,
          firstName: "Jane",
          lastName: "Smith",
          isLocationVisible: true,
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "mike_wilson",
          email: "mike.wilson@example.com",
          password: hashedPassword,
          firstName: "Mike",
          lastName: "Wilson",
          isLocationVisible: false,
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "sarah_johnson",
          email: "sarah.johnson@example.com",
          password: hashedPassword,
          firstName: "Sarah",
          lastName: "Johnson",
          isLocationVisible: true,
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "alex_brown",
          email: "alex.brown@example.com",
          password: hashedPassword,
          firstName: "Alex",
          lastName: "Brown",
          isLocationVisible: true,
          isOnline: false,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {})
  },
}
