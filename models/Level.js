const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');
const Tournament = require('./Tournament');

class Level extends Model { }

Level.init({
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  small_blind: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  big_blind: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tournamentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tournament,
      key: 'id'
    }
  }
}, { sequelize, modelName: 'level' });

module.exports = Level;
