const path = require('path');
const { Sequelize } = require('sequelize');
const Users = require('./Users');
const Tournaments = require('./Tournaments');
const Levels = require('./Levels');
const Players = require('./Players');
const PlayersTournaments = require('./PlayersTournaments');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'home-gamer-sqlite')
});

// Initialize models
Users.initModel(sequelize);
Players.initModel(sequelize);
Tournaments.initModel(sequelize);
PlayersTournaments.initModel(sequelize);
Levels.initModel(sequelize);

// Establish associations
Users.associate({ Players });
Players.associate({ Users, Tournaments });
Tournaments.associate({ Levels, Players });

module.exports = sequelize;
