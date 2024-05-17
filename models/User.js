const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Assuming your config file is named db_config.js

module.exports = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
  }
);
