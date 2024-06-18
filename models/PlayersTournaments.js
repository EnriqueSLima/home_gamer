const { Model, DataTypes } = require('sequelize');
const Users = require('../models/Users');

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
          model: 'Players',
          key: 'id'
        }
      },
      tournamentId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Tournaments',
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
      },
      player_status: {
        type: DataTypes.ENUM('in', 'out'),
        defaultValue: 'in'
      }
    }, {
      sequelize,
      modelName: 'PlayersTournaments',
      tableName: 'PlayersTournaments'
    });
  }
  static associate(models) {
    PlayersTournaments.belongsTo(models.Players, {
      foreignKey: 'playerId',
      as: 'Player',
      include: [
        {
          model: Users,
          attributes: ['name']
        }
      ]
    });
    PlayersTournaments.belongsTo(models.Tournaments, { foreignKey: 'tournamentId' });
  }
}

module.exports = PlayersTournaments;
