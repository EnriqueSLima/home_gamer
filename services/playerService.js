const Player = require('../models/Player');
const { Op } = require('sequelize');

// Function to create a new player
async function createPlayer(data) {
  const { name, email, username } = data;

  const player = await Player.create({
    name,
    email,
    username
  });

  return player;
}

// Function to get a player by ID
async function getPlayerById(id) {
  const player = await Player.findByPk(id);

  return player;
}

// Function to get all players
async function getAllPlayers() {
  const players = await Player.findAll();

  return players;
}

// Function to update a player
async function updatePlayer(id, data) {
  const { name, email, username } = data;

  const player = await Player.findByPk(id);
  if (!player) {
    throw new Error('Player not found');
  }

  await player.update({
    name,
    email,
    username
  });

  return player;
}

// Function to delete a player
async function deletePlayer(id) {
  const player = await Player.findByPk(id);
  if (!player) {
    throw new Error('Player not found');
  }

  await player.destroy();

  return { message: 'Player deleted successfully' };
}

module.exports = {
  createPlayer,
  getPlayerById,
  getAllPlayers,
  updatePlayer,
  deletePlayer
};
