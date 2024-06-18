const { Model, DataTypes } = require('sequelize');

class Levels extends Model {
  static initModel(sequelize) {
    Levels.init({
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
      modelName: 'Levels',
      tableName: 'Levels'
    });
  }

  static associate(models) {
    Levels.belongsTo(models.Tournaments, { foreignKey: 'tournamentId', as: 'Tournaments' });
  }
}

module.exports = Levels;
