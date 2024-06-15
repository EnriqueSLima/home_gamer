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
        defaultValue: false
      }
    }, {
      sequelize,
      modelName: 'tournament',
      hooks: {
        beforeSave: setActiveTournament,
        beforeUpdate: setActiveTournament,
        afterFind: async (tournament) => {
          // Set all other tournaments to not active
          await Tournament.update({ is_active: false }, {
            where: {
              id: {
                [Op.not]: tournament.id
              }
            }
          });

          // Set the current tournament to active
          tournament.is_active = true;
          await tournament.save();
        }
      }
    });
  }

  static associate(models) {
    Tournament.hasMany(models.Level, { foreignKey: 'tournamentId', as: 'Levels' });
  }
}
async function setActiveTournament(tournament) {
  tournament.is_active = true;

  await Tournament.update({ is_active: false }, {
    where: {
      id: { [Op.not]: tournament.id }
    }
  });
}

module.exports = Tournament;
