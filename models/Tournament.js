const { Model, DataTypes, Op } = require('sequelize');

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
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false  // Set new tournaments as inactive by default
      }
    }, {
      sequelize,
      modelName: 'Tournament',
      hooks: {
        afterFind: setActiveTournament
      }
    });
  }

  static associate(models) {
    Tournament.hasMany(models.Level, { foreignKey: 'tournamentId', as: 'Levels' });
  }
}

async function setActiveTournament(tournament) {
  if (tournament) {
    await Tournament.update({ is_active: false }, {
      where: {
        id: { [Op.not]: tournament.id }
      },
    });
    tournament.is_active = true;
    await tournament.save();
  }
}

module.exports = Tournament;
