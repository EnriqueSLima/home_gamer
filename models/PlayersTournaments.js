const { Model, DataTypes } = require('sequelize');
const Users = require('../models/Users');
const { getActiveTournament } = require('../services/tournamentsService');

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
      tableName: 'PlayersTournaments',
      hooks: {
        afterCreate: async (instance) => {
          await setPlayerTotal(instance);
        },
        afterUpdate: async (instance) => {
          await setPlayerTotal(instance);
        }
      }
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

async function setPlayerTotal(instance) {
  const { playerId, tournamentId } = instance;

  const tournament = await getActiveTournament();
  if (!tournament) {
    throw new Error('Active tournament not found');
  }

  const playerTournament = await PlayersTournaments.findOne({
    where: { playerId, tournamentId }
  });

  if (!playerTournament) {
    throw new Error('PlayerTournament record not found');
  }

  playerTournament.total = tournament.buyin_money + (playerTournament.rebuys * tournament.rebuy_money);
  if (playerTournament.addon) {
    playerTournament.total += tournament.addon_money;
  }
  await playerTournament.save();
}

module.exports = PlayersTournaments;
