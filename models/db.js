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
const models = { Users, Players, Tournaments, PlayersTournaments, Levels };

Users.associate(models);
Players.associate(models);
Tournaments.associate(models);
PlayersTournaments.associate(models);
Levels.associate(models);

console.log(Players.associations);
console.log(PlayersTournaments.associations);
module.exports = sequelize;
