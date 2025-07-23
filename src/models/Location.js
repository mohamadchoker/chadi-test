const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Location = sequelize.define(
    "Location",
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
        comment: "Location accuracy in meters",
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: "locations",
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

  return Location
}
