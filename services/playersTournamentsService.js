const PlayersTournaments = require('../models/PlayersTournaments');
const Players = require('../models/Players');
const Users = require('../models/Users');
const Sequelize = require('sequelize');

async function registerPlayer(playerId, rebuys, addon) {
  const { getActiveTournament } = require('../services/tournamentsService');
  const activeTournament = await getActiveTournament();
  if (!activeTournament) {
    throw new Error('No active tournament found');
  }

  const playerTournament = await PlayersTournaments.create({
    playerId,
    tournamentId: activeTournament.id,
    rebuys,
    addon,
    total: 0, // Initial total, will be set in the hook
    player_status: 'in' // Initial status
  });

  return playerTournament;
}

// Function to eliminate a player from a tournament
async function eliminatePlayer(playerId, tournamentId) {
  try {
    const playerTournament = await PlayersTournaments.findOne({
      where: {
        playerId,
        tournamentId
      }
    });

    if (!playerTournament) {
      throw new Error('Player registration not found in tournament');
    }

    playerTournament.player_status = 'out';
    await playerTournament.save();

    return playerTournament;
  } catch (error) {
    console.error('Error eliminating player:', error);
    throw error;
  }
}

async function updatePlayer(playerId, rebuy, addon) {
  try {
    const activeTournament = await getActiveTournament();
    if (!activeTournament) {
      throw new Error('No active tournament found');
    }

    let playerTournament = await PlayersTournaments.findOne({
      where: {
        playerId,
        tournamentId: activeTournament.id,
      }
    });

    if (!playerTournament) {
      throw new Error('Player registration not found in tournament');
    }

    // Update rebuy and addon values
    playerTournament.rebuys = rebuy;
    playerTournament.addon = addon;
    await playerTournament.save();

    return { message: 'Player information updated successfully' };
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
}

async function getPlayerCount(tournamentId) {
  const playerCount = await PlayersTournaments.count({
    where: { tournamentId }
  });
  return playerCount;
}

async function getPlayersIn(tournamentId) {
  const playersIn = await PlayersTournaments.findAll({
    where: {
      tournamentId,
      player_status: 'in'
    },
    include: [{
      model: Players,
      as: 'Player',
      include: [{
        model: Users,
        as: 'User'
      }]
    }]
  });
  return playersIn;
}

async function getPlayersInCount(tournamentId) {
  const playersInCount = await PlayersTournaments.count({
    where: {
      tournamentId,
      player_status: 'in'
    }
  });
  return playersInCount;
}

async function getPlayersOut(tournamentId) {
  const playersOut = await PlayersTournaments.findAll({
    where: {
      tournamentId,
      player_status: 'out'
    },
    include: [{
      model: Players,
      as: 'Player',
      include: [{
        model: Users,
        as: 'User'
      }]
    }]
  });
  return playersOut;
}

async function getRebuyCount(tournamentId) {
  const rebuyCount = await PlayersTournaments.count({
    where: {
      tournamentId,
      rebuys: {
        [Sequelize.Op.gt]: 0 // Only count entries where rebuys > 0
      }
    }
  });
  return rebuyCount;
}

async function getAddonCount(tournamentId) {
  const addonCount = await PlayersTournaments.count({
    where: {
      tournamentId,
      addon: true
    }
  });
  return addonCount;
}

module.exports = {
  registerPlayer,
  eliminatePlayer,
  updatePlayer,
  getPlayerCount,
  getPlayersIn,
  getPlayersInCount,
  getPlayersOut,
  getRebuyCount,
  getAddonCount
};
