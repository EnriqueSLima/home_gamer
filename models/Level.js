const { Model, DataTypes } = require('sequelize');

class Level extends Model {
  static initModel(sequelize) {
    Level.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
          model: 'Tournaments',
          key: 'id'
        }
      }
    }, {
      sequelize,
      modelName: 'Level'
    });
  }

  static associate(models) {
    Level.belongsTo(models.Tournament, { foreignKey: 'tournamentId', as: 'Tournament' });
  }
}

module.exports = Level;
