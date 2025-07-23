/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()
    const locationHistory = []

    // Generate location history for John Doe (userId: 1) - Moving around NYC
    const johnLocations = [
      { lat: 40.7128, lng: -74.006 }, // Times Square
      { lat: 40.7589, lng: -73.9851 }, // Central Park
      { lat: 40.7505, lng: -73.9934 }, // Empire State Building
      { lat: 40.7061, lng: -74.0087 }, // Brooklyn Bridge
      { lat: 40.7282, lng: -73.7949 }, // Queens
    ]

    // Generate history for the last 2 hours with 20-second intervals
    for (let i = 0; i < johnLocations.length; i++) {
      const timestamp = new Date(now.getTime() - i * 20 * 1000) // 20 seconds apart
      locationHistory.push({
        userId: 1,
        latitude: johnLocations[i].lat + (Math.random() - 0.5) * 0.001, // Add small random variation
        longitude: johnLocations[i].lng + (Math.random() - 0.5) * 0.001,
        accuracy: 8 + Math.random() * 10, // Random accuracy between 8-18 meters
        timestamp: timestamp,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Generate location history for Sarah Johnson (userId: 4) - Moving around Tokyo
    const sarahLocations = [
      { lat: 35.6762, lng: 139.6503 }, // Tokyo Station
      { lat: 35.6586, lng: 139.7454 }, // Tokyo Skytree
      { lat: 35.6895, lng: 139.6917 }, // Imperial Palace
      { lat: 35.6598, lng: 139.7006 }, // Tsukiji
      { lat: 35.6751, lng: 139.7648 }, // Asakusa
    ]

    for (let i = 0; i < sarahLocations.length; i++) {
      const timestamp = new Date(now.getTime() - i * 25 * 1000) // 25 seconds apart
      locationHistory.push({
        userId: 4,
        latitude: sarahLocations[i].lat + (Math.random() - 0.5) * 0.001,
        longitude: sarahLocations[i].lng + (Math.random() - 0.5) * 0.001,
        accuracy: 10 + Math.random() * 8,
        timestamp: timestamp,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Generate some older history for Jane Smith (userId: 2) - London
    const janeLocations = [
      { lat: 51.5074, lng: -0.1278 }, // London Bridge
      { lat: 51.5014, lng: -0.1419 }, // Big Ben
      { lat: 51.5155, lng: -0.0922 }, // Tower Bridge
      { lat: 51.5194, lng: -0.127 }, // British Museum
    ]

    for (let i = 0; i < janeLocations.length; i++) {
      const timestamp = new Date(now.getTime() - 45 * 60 * 1000 - i * 30 * 1000) // 45 minutes ago, 30 seconds apart
      locationHistory.push({
        userId: 2,
        latitude: janeLocations[i].lat + (Math.random() - 0.5) * 0.001,
        longitude: janeLocations[i].lng + (Math.random() - 0.5) * 0.001,
        accuracy: 12 + Math.random() * 6,
        timestamp: timestamp,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    await queryInterface.bulkInsert("location_history", locationHistory, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("location_history", null, {})
  },
}
