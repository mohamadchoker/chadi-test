const { DataTypes } = require("sequelize")
const bcrypt = require("bcryptjs")

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [6, 255],
          notEmpty: true,
        },
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      isLocationVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Controls if user location is visible to others",
      },
      isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Tracks if user is currently online",
      },
      lastSeen: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      hooks: {
        // Hash password before saving
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12)
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12)
          }
        },
      },
    },
  )

  // Instance method to check password
  User.prototype.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  // Instance method to get public profile
  User.prototype.getPublicProfile = function () {
    const { password, ...publicProfile } = this.toJSON()
    return publicProfile
  }

  return User
}
