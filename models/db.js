const path = require('path');
const { Sequelize } = require('sequelize');
const Tournament = require('./Tournament');
const Level = require('./Level');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'home-gamer-sqlite')
});

// Initialize models
Tournament.initModel(sequelize);
Level.initModel(sequelize);

// Establish associations
Tournament.associate({ Level });
Level.associate({ Tournament });

module.exports = sequelize;
