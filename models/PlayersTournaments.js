const { Model, DataTypes } = require('sequelize');

class PlayersTournaments extends Model {
  static initModel(sequelize) {
    PlayersTournaments.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      playerId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Player',
          key: 'id'
        }
      },
      tournamentId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Tournament',
          key: 'id'
        }
      },
      rebuys: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      addon: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      total: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      sequelize,
      modelName: 'PlayersTournaments',
      tableName: 'PlayersTournaments'
    });
  }
}

module.exports = PlayersTournaments;
