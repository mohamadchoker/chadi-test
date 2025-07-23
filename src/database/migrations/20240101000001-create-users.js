/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      isLocationVisible: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "Controls if user location is visible to others",
      },
      isOnline: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "Tracks if user is currently online",
      },
      lastSeen: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    })

    // Add indexes for better performance
    await queryInterface.addIndex("users", ["email"], {
      name: "idx_users_email",
    })

    await queryInterface.addIndex("users", ["username"], {
      name: "idx_users_username",
    })

    await queryInterface.addIndex("users", ["isOnline"], {
      name: "idx_users_online",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users")
  },
}
