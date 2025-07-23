const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const LocationHistory = sequelize.define(
    "LocationHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
      },
      accuracy: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: "location_history",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["timestamp"],
        },
        {
          fields: ["userId", "timestamp"],
        },
      ],
    },
  )

  return LocationHistory
}
