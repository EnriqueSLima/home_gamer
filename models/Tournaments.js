const { Model, DataTypes, Op } = require('sequelize');

class Tournaments extends Model {
  static initModel(sequelize) {
    Tournaments.init({
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
      },
      chip_count: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      pot_total: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      clockStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Initially paused
      },
      clockValue: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      sequelize,
      modelName: 'Tournaments',
      tableName: 'Tournaments',
      hooks: {
        afterFind: setActiveTournament
      }
    });
  }

  static associate(models) {
    Tournaments.hasMany(models.Levels, { foreignKey: 'tournamentId', as: 'Levels' });
    Tournaments.belongsToMany(models.Players, {
      through: 'PlayersTournaments',
      foreignKey: 'tournamentId',
      otherKey: 'playerId',
      as: 'Participants'
    });
  }
}

async function setActiveTournament(tournament) {
  if (tournament) {
    await Tournaments.update({ is_active: false }, {
      where: {
        id: { [Op.not]: tournament.id }
      },
    });
    tournament.is_active = true;
    await tournament.save();
  }
}

module.exports = Tournaments;
