const { Model, DataTypes } = require('sequelize');

class Players extends Model {
  static initModel(sequelize) {
    Players.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    }, {
      sequelize,
      modelName: 'Players',
      tableName: 'Players'
    });
  }

  static associate(models) {
    Players.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    });
    Players.belongsToMany(models.Tournaments, {
      through: 'PlayersTournaments',
      foreignKey: 'playerId',
      otherKey: 'tournamentId'
    });
  }
}

module.exports = Players;
