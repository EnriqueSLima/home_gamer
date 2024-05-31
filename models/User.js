const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class User extends Model {
  toJSON() {
    return { ...this.dataValues, password: undefined }; // Exclude password
  }
}

User.init({
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
}, { sequelize, modelName: 'user' });

module.exports = User;
