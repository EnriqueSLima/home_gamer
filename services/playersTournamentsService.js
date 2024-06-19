const tournamentService = require('./tournamentsService')
const Players = require('../models/Players');
const PlayersTournaments = require('../models/PlayersTournaments');
const Users = require('../models/Users');

// Function to register a player to a tournament
async function registerPlayer(playerId, rebuys, addon) {
  const activeTournament = await tournamentService.getActiveTournament();
  if (!activeTournament) {
    throw new Error('No active tournament found');
  }

  await PlayersTournaments.create({
    playerId: playerId,
    tournamentId: activeTournament.id,
    rebuys: rebuys,
    addon: addon,
  });

  return { message: 'Player registered to tournament successfully' };
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
    const activeTournament = await tournamentService.getActiveTournament();
    if (!activeTournament) {
      throw new Error('No active tournament found');
    }

    const playerTournament = await PlayersTournaments.findOne({
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

module.exports = {
  registerPlayer,
  eliminatePlayer,
  updatePlayer,
  getPlayersIn,
  getPlayersOut
};
