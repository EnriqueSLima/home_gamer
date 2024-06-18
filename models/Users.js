const { Model, DataTypes } = require('sequelize');
const Players = require('./Players'); // Import the Players model

class Users extends Model {
  static initModel(sequelize) {
    Users.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'manager', 'client'),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Users',
      tableName: 'Users',
      hooks: {
        afterCreate: createPlayer
      }
    });
  }

  static associate(models) {
    // Define associations here
    Users.hasOne(models.Players, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }

  toJSON() {
    return { ...this.dataValues, password: undefined }; // Exclude password
  }
}

async function createPlayer(user) {
  await user.createPlayer({ userId: user.id });
}

module.exports = Users;
