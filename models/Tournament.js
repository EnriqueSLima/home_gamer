const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');
const Level = require('./Level');

class Tournament extends Model { }

Tournament.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  buyin_money: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  buyin_chips: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rebuy_money: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rebuy_chips: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  addon_money: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  addon_chips: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { sequelize, modelName: 'tournament' });

Tournament.hasMany(Level, { foreignKey: 'tournamentId' });
Level.belongsTo(Tournament, { foreignKey: 'tournamentId' });

module.exports = Tournament;
