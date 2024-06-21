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
        tournamentId,
        playerId,
      },
      include: [{
        model: Players,
        as: 'Player'
      }]
    });

    if (!playerTournament) {
      throw new Error('Player registration not found in tournament');
    }

    const position = await updatePlayerPosition(playerId, tournamentId);
    playerTournament.position = position; // Set the position to the returned value
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
    const { getActiveTournament } = require('../services/tournamentsService');
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
  console.log(`PLAYERS IN COUNTTTTTTTTTTTT: ${playersInCount}`);
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
    }],
    attributes: ['Player.id', 'Player.User.name', 'position'] // Include position attribute
  });
  return playersOut;
}

async function getRebuyCount(tournamentId) {
  const rebuyCount = await PlayersTournaments.sum('rebuys', {
    where: {
      tournamentId
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

async function updatePlayerPosition(playerId, tournamentId) {
  try {
    const playersInCount = await getPlayersInCount(tournamentId);
    const positionAsNumber = Number(playersInCount); // Convert to number

    const player = await PlayersTournaments.findOne({
      where: {
        playerId,
        tournamentId,
      }
    });

    if (!player) {
      throw new Error('Player registration not found in tournament');
    }

    player.position = positionAsNumber; // Ensure player.position is a number
    await player.save();

    console.log(`PLAYER POSITION: ${player.position}`); // Log the updated position

    return positionAsNumber; // Return the actual position value
  } catch (error) {
    console.error('Error updating player position:', error);
    throw error;
  }
}

//async function updatePlayerPosition(tournamentId) {
//  const playersInCount = await getPlayersInCount(tournamentId);
//  return playersInCount; // Return current count as position (starting from total count)
//}

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
