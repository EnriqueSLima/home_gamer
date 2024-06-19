const { sequelize, models } = require('../models/db'); // Import Sequelize instance and models
const Users = models.Users; // Import Users model
const Tournaments = models.Tournaments; // Import Tournaments model
const Levels = models.Levels; // Import Levels model

// Sample data for users, tournaments, and levels
const usersData = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager'
  },
  {
    name: 'Client User',
    email: 'client@example.com',
    password: 'client123',
    role: 'client'
  }
];

const tournamentsData = [
  {
    buyin_money: 100,
    buyin_chips: 1000,
    rebuy_money: 50,
    rebuy_chips: 500,
    addon_money: 25,
    addon_chips: 250,
    is_active: true
  },
  {
    buyin_money: 200,
    buyin_chips: 2000,
    rebuy_money: 100,
    rebuy_chips: 1000,
    addon_money: 50,
    addon_chips: 500,
    is_active: false
  }
];

const levelsData = [
  {
    duration: 30,
    small_blind: 10,
    big_blind: 20,
    tournamentId: 1 // Adjust with the correct tournamentId from tournamentsData
  },
  {
    duration: 20,
    small_blind: 15,
    big_blind: 30,
    tournamentId: 2 // Adjust with the correct tournamentId from tournamentsData
  }
];

// Function to seed the database
async function seed() {
  try {
    await sequelize.sync({ force: false }); // Sync models and recreate tables (force: true for development purposes)

    // Seed users
    await Users.bulkCreate(usersData, { individualHooks: true }); // Use individualHooks for afterCreate hook

    // Seed tournaments
    await Tournaments.bulkCreate(tournamentsData);

    // Seed levels
    await Levels.bulkCreate(levelsData);

    console.log('Seed data successfully inserted.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close(); // Close the database connection
  }
}

// Call the seed function
seed();
