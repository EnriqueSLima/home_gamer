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
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false  // Set new tournaments as inactive by default
      },
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
      otherKey: 'playerId'
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
