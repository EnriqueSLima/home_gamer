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

      res.render('display', {
        css: 'display.css',
        js: 'display.js',
        user: req.user,
        playerCount,
        playersInCount
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
