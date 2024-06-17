const Tournament = require('../models/Tournament');
const Level = require('../models/Level');
const { Op } = require('sequelize');

// Function to create a new tournament
async function createTournament(data) {
  const { buyin_money, buyin_chips, rebuy_money, rebuy_chips, addon_money, addon_chips, levels } = data;

  const tournament = await Tournament.create({
    buyin_money,
    buyin_chips,
    rebuy_money,
    rebuy_chips,
    addon_money,
    addon_chips,
  });

  for (const level of levels) {
    await Level.create({
      duration: level.duration,
      small_blind: level.small_blind,
      big_blind: level.big_blind,
      tournamentId: tournament.id
    });
  }

  // Ensure only the newly created tournament is active
  await setActiveTournament(tournament);

  return tournament;
}

// Function to get a tournament by ID
async function getTournamentById(id) {
  const tournament = await Tournament.findByPk(id, {
    include: [{ model: Level, as: 'Levels' }]
  });

  if (tournament) {
    await setActiveTournament(tournament);
  }

  return tournament;
}

// Function to update a tournament
async function updateTournament(id, data) {
  const { buyin_money, buyin_chips, rebuy_money, rebuy_chips, addon_money, addon_chips, levels } = data;

  const tournament = await Tournament.findByPk(id);
  if (!tournament) {
    throw new Error('Tournament not found');
  }

  await tournament.update({
    buyin_money,
    buyin_chips,
    rebuy_money,
    rebuy_chips,
    addon_money,
    addon_chips,
  });

  await Level.destroy({ where: { tournamentId: id } });

  for (const level of levels) {
    await Level.create({
      duration: level.duration,
      small_blind: level.small_blind,
      big_blind: level.big_blind,
      tournamentId: id
    });
  }

  await setActiveTournament(tournament);

  return tournament;
}

// Function to delete a tournament
async function deleteTournament(id) {
  const tournament = await Tournament.findByPk(id);
  if (!tournament) {
    throw new Error('Tournament not found');
  }

  await Level.destroy({ where: { tournamentId: id } });
  await tournament.destroy();

  return { message: 'Tournament deleted successfully' };
}

// Function to get the active tournament
async function getActiveTournament() {
  const tournament = await Tournament.findOne({
    where: { is_active: true },
    include: [{ model: Level, as: 'Levels' }]
  });

  return tournament;
}

// Helper function to set the active tournament
async function setActiveTournament(tournament) {
  await Tournament.update({ is_active: false }, {
    where: {
      id: { [Op.not]: tournament.id }
    },
  });
  tournament.is_active = true;
}

module.exports = {
  createTournament,
  getTournamentById,
  updateTournament,
  deleteTournament,
  getActiveTournament
};
