const tournamentService = require('./tournamentsService')
const Players = require('../models/Players');
const PlayersTournaments = require('../models/PlayersTournaments');
const Users = require('../models/Users');

// Function to register a player to a tournament
async function registerPlayer(playerId) {
  const activeTournament = await tournamentService.getActiveTournament();
  if (!activeTournament) {
    throw new Error('No active tournament found');
  }

  const player = await Players.findByPk(playerId);
  if (!player) {
    throw new Error('Player not found');
  }
  await PlayersTournaments.create({
    playerId: player.id,
    tournamentId: activeTournament.id
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
  console.log('Players In:', JSON.stringify(playersIn, null, 2));
  console.log(`GET PLAYERS IN ======  ${playersIn}`)
  console.log(`IN TOURNAMENT ID ${tournamentId}`)
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
  console.log('Players Out:', JSON.stringify(playersOut, null, 2));
  console.log(`GET PLAYERS OUT ======  ${playersOut}`)
  console.log(`OUT TOURNAMENT ID ${tournamentId}`)
  return playersOut;
}

module.exports = {
  registerPlayer,
  eliminatePlayer,
  getPlayersIn,
  getPlayersOut
};
