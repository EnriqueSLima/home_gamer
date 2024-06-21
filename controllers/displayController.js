const { getActiveTournament } = require('../services/tournamentsService');
const playersTournamentsService = require('../services/playersTournamentsService');

module.exports = {
  displayView: async (req, res) => {
    try {
      const activeTournament = await getActiveTournament();
      if (!activeTournament) {
        return res.render('display', {
          css: 'display.css',
          js: 'display.js',
          user: req.user,
          error: 'No active tournament found'
        });
      }

      const playerCount = await playersTournamentsService.getPlayerCount(activeTournament.id);
      const playersInCount = await playersTournamentsService.getPlayersInCount(activeTournament.id);
      const rebuyCount = await playersTournamentsService.getRebuyCount(activeTournament.id);
      const addonCount = await playersTournamentsService.getAddonCount(activeTournament.id);
      const potTotal = activeTournament.pot_total;
      const chipCount = activeTournament.chip_count;
      const average = chipCount / playerCount;
      res.render('display', {
        css: 'display.css',
        js: 'display.js',
        user: req.user,
        playerCount,
        playersInCount,
        rebuyCount,
        addonCount,
        potTotal,
        chipCount,
        average
      });
    } catch (error) {
      console.error('Failed to fetch player count:', error);
      res.status(500).render('display', {
        css: 'display.css',
        js: 'display.js',
        user: req.user,
        error: 'Failed to fetch player count'
      });
    }
  }
};
