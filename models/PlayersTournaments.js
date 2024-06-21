const { Model, DataTypes } = require('sequelize');
const Users = require('../models/Users');
const Tournaments = require('../models/Tournaments');

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
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'PlayersTournaments',
      tableName: 'PlayersTournaments',
      hooks: {
        afterCreate: async (instance) => {
          await setPlayerTotal(instance);
          const { updatePotTotal, updateChipCount } = require('../services/tournamentsService');
          await updatePotTotal(instance.tournamentId); // Update pot total after create
          await updateChipCount(instance.tournamentId); // Update chip count after create
        },
        afterUpdate: async (instance) => {
          await setPlayerTotal(instance);
          const { updatePotTotal, updateChipCount } = require('../services/tournamentsService');
          await updatePotTotal(instance.tournamentId); // Update pot total after update
          await updateChipCount(instance.tournamentId); // Update chip count after update
        },
        afterBulkCreate: async (instances) => {
          for (const instance of instances) {
            await setPlayerTotal(instance);
            const { updatePotTotal, updateChipCount } = require('../services/tournamentsService');
            await updatePotTotal(instance.tournamentId); // Update pot total after bulk create
            await updateChipCount(instance.tournamentId); // Update chip count after bulk create
          }
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

  // Use dynamic import to avoid circular dependency
  const { getActiveTournament } = await import('../services/tournamentsService.js');
  const tournament = await getActiveTournament();
  if (!tournament) {
    throw new Error('Active tournament not found');
  }

  let playerTournament = await PlayersTournaments.findOne({
    where: { playerId, tournamentId }
  });

  if (!playerTournament) {
    throw new Error('PlayerTournament record not found');
  }

  let newTotal = tournament.buyin_money + (playerTournament.rebuys * tournament.rebuy_money);
  if (playerTournament.addon) {
    newTotal += tournament.addon_money;
  }

  if (playerTournament.total !== newTotal) {
    await playerTournament.update({
      total: newTotal
    });
  }
}

module.exports = PlayersTournaments;
