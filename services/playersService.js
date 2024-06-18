const Players = require('../models/Players');
const { Op } = require('sequelize');
const Users = require('../models/Users');

// Function to create a new player
async function createPlayer(data) {
  const { name, email, username } = data;

  const player = await Players.create({
    name,
    email,
    username
  });

  return player;
}

// Function to get a player by ID
async function getPlayerById(id) {
  const player = await Players.findByPk(id);

  return player;
}

async function searchPlayers(searchTerm) {
  const players = await Users.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { id: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } },
      ],
    },
  });
  return players;
}

// Function to get all players
async function getAllPlayers() {
  const players = await Players.findAll();

  return players;
}

// Function to update a player
async function updatePlayer(id, data) {
  const { name, email, username } = data;

  const player = await Players.findByPk(id);
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
  const player = await Players.findByPk(id);
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
  deletePlayer,
  searchPlayers
};
