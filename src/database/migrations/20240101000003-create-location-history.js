/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("location_history", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
      },
      accuracy: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: "Location accuracy in meters",
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
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

    // Add indexes for efficient location history queries
    await queryInterface.addIndex("location_history", ["userId"], {
      name: "idx_location_history_user_id",
    })

    await queryInterface.addIndex("location_history", ["timestamp"], {
      name: "idx_location_history_timestamp",
    })

    await queryInterface.addIndex("location_history", ["userId", "timestamp"], {
      name: "idx_location_history_user_timestamp",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("location_history")
  },
}
