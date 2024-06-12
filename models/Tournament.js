const { Model, DataTypes } = require('sequelize');

class Tournament extends Model {
  static initModel(sequelize) {
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
  }

  static associate(models) {
    Tournament.hasMany(models.Level, { foreignKey: 'tournamentId', as: 'Levels' });
  }
}

module.exports = Tournament;
