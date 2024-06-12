const { Model, DataTypes } = require('sequelize');

class Level extends Model {
  static initModel(sequelize) {
    Level.init({
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      small_blind: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      big_blind: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tournamentId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'tournaments',  // Ensure this matches the table name
          key: 'id'
        }
      }
    }, { sequelize, modelName: 'level' });
  }

  static associate(models) {
    Level.belongsTo(models.Tournament, { foreignKey: 'tournamentId', as: 'Tournament' });
  }
}

module.exports = Level;
