/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("locations", {
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

    // Add indexes for better query performance
    await queryInterface.addIndex("locations", ["userId"], {
      name: "idx_locations_user_id",
    })

    await queryInterface.addIndex("locations", ["timestamp"], {
      name: "idx_locations_timestamp",
    })

    await queryInterface.addIndex("locations", ["userId", "timestamp"], {
      name: "idx_locations_user_timestamp",
    })

    // Add unique constraint to ensure one current location per user
    await queryInterface.addIndex("locations", ["userId"], {
      unique: true,
      name: "unique_user_location",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("locations")
  },
}
