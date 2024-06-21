const { sequelize, models } = require('../models/db');
const Users = models.Users;
const Tournaments = models.Tournaments;
const Levels = models.Levels;
const Players = models.Players;
const PlayersTournaments = models.PlayersTournaments;
const bcrypt = require('bcryptjs');

// Sample data for users, tournaments, and levels
const usersData = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 8),
    role: 'admin'
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: bcrypt.hashSync('manager123', 8),
    role: 'manager'
  },
  {
    name: 'Client User',
    email: 'client@example.com',
    password: bcrypt.hashSync('client123', 8),
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
  },
  {
    buyin_money: 300,
    buyin_chips: 3000,
    rebuy_money: 150,
    rebuy_chips: 1500,
    addon_money: 75,
    addon_chips: 750,
    is_active: true
  },
  {
    buyin_money: 400,
    buyin_chips: 4000,
    rebuy_money: 200,
    rebuy_chips: 2000,
    addon_money: 100,
    addon_chips: 1000,
    is_active: false
  },
  {
    buyin_money: 500,
    buyin_chips: 5000,
    rebuy_money: 250,
    rebuy_chips: 2500,
    addon_money: 125,
    addon_chips: 1250,
    is_active: true
  }
];

const levelsData = [
  // Levels for Tournament 1
  { duration: 1, small_blind: 10, big_blind: 20, tournamentId: 1 },
  { duration: 40, small_blind: 15, big_blind: 30, tournamentId: 1 },
  { duration: 50, small_blind: 20, big_blind: 40, tournamentId: 1 },
  { duration: 60, small_blind: 25, big_blind: 50, tournamentId: 1 },
  { duration: 70, small_blind: 30, big_blind: 60, tournamentId: 1 },

  // Levels for Tournament 2
  { duration: 20, small_blind: 5, big_blind: 10, tournamentId: 2 },
  { duration: 30, small_blind: 10, big_blind: 20, tournamentId: 2 },
  { duration: 40, small_blind: 15, big_blind: 30, tournamentId: 2 },
  { duration: 50, small_blind: 20, big_blind: 40, tournamentId: 2 },
  { duration: 60, small_blind: 25, big_blind: 50, tournamentId: 2 },

  // Levels for Tournament 3
  { duration: 25, small_blind: 10, big_blind: 20, tournamentId: 3 },
  { duration: 35, small_blind: 15, big_blind: 30, tournamentId: 3 },
  { duration: 45, small_blind: 20, big_blind: 40, tournamentId: 3 },
  { duration: 55, small_blind: 25, big_blind: 50, tournamentId: 3 },
  { duration: 65, small_blind: 30, big_blind: 60, tournamentId: 3 },

  // Levels for Tournament 4
  { duration: 20, small_blind: 10, big_blind: 20, tournamentId: 4 },
  { duration: 30, small_blind: 15, big_blind: 30, tournamentId: 4 },
  { duration: 40, small_blind: 20, big_blind: 40, tournamentId: 4 },
  { duration: 50, small_blind: 25, big_blind: 50, tournamentId: 4 },
  { duration: 60, small_blind: 30, big_blind: 60, tournamentId: 4 },

  // Levels for Tournament 5
  { duration: 35, small_blind: 10, big_blind: 20, tournamentId: 5 },
  { duration: 45, small_blind: 15, big_blind: 30, tournamentId: 5 },
  { duration: 55, small_blind: 20, big_blind: 40, tournamentId: 5 },
  { duration: 65, small_blind: 25, big_blind: 50, tournamentId: 5 },
  { duration: 75, small_blind: 30, big_blind: 60, tournamentId: 5 }
];

const playersTournamentsData = [
  { playerId: 1, tournamentId: 1 },
  { playerId: 2, tournamentId: 1 },
  { playerId: 3, tournamentId: 1 },
  { playerId: 1, tournamentId: 2 },
  { playerId: 2, tournamentId: 2 },
  { playerId: 3, tournamentId: 3 },
  { playerId: 1, tournamentId: 3 },
  { playerId: 2, tournamentId: 4 },
  { playerId: 3, tournamentId: 4 },
  { playerId: 1, tournamentId: 5 },
  { playerId: 2, tournamentId: 5 },
  { playerId: 3, tournamentId: 5 }
];

// Function to seed the database
async function seed() {
  try {
    await sequelize.sync({ force: false }); // Sync models and recreate tables (force: true for development purposes)

    // Seed users
    const users = await Users.bulkCreate(usersData, { individualHooks: true }); // Use individualHooks for afterCreate hook

    // Seed players
    const players = await Promise.all(users.map(async (user) => {
      const player = await Players.create({ userId: user.id });
      return player;
    }));

    // Seed tournaments
    await Tournaments.bulkCreate(tournamentsData);

    // Seed levels
    await Levels.bulkCreate(levelsData);

    // Seed players tournaments
    await PlayersTournaments.bulkCreate(playersTournamentsData);

    console.log('Seed data successfully inserted.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close(); // Close the database connection
  }
}

// Call the seed function
seed();
