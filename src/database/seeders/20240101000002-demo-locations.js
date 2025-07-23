/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Sample locations for demo users (using various cities around the world)
    const locations = [
      {
        userId: 1, // John Doe - New York City
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10.5,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Jane Smith - London
        latitude: 51.5074,
        longitude: -0.1278,
        accuracy: 8.2,
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4, // Sarah Johnson - Tokyo
        latitude: 35.6762,
        longitude: 139.6503,
        accuracy: 12.1,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5, // Alex Brown - Sydney
        latitude: -33.8688,
        longitude: 151.2093,
        accuracy: 15.3,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await queryInterface.bulkInsert("locations", locations, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("locations", null, {})
  },
}
