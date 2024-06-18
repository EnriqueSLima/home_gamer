const playerService = require('../services/playersService')
const tournamentService = require('../services/tournamentsService');

module.exports = {

  playerView: async (req, res) => {

    const activeTournament = await tournamentService.getActiveTournament();

    res.render('player-settings', {
      css: 'player-settings.css',
      js: 'player-settings.js',
      user: req.user
    });
  },

  addPlayer: async (req, res) => {
    const { playerId } = req.body;

    try {
      const result = await playerService.registerPlayer(playerId);
      res.json(result);
    } catch (error) {
      console.error('Failed to register player:', error);
      res.status(500).json({ error: 'Failed to register player' });
    }
  },

  searchPlayer: async (req, res) => {
    //console.log('Request body:', req.body);
    const { playerName } = req.body;
    //console.log(playerName)
    try {
      const players = await playerService.searchPlayers(playerName);
      console.log(`Players before render ${players}`)
      if (!players) {
        res.render('player-settings', {
          css: 'player-settings.css',
          js: 'player-settings.js',
          user: req.user,
          error: 'No players found',
          players: [] // Initialize an empty array for players
        });
      } else {
        res.render('player-settings', {
          css: 'player-settings.css',
          js: 'player-settings.js',
          user: req.user,
          players: players
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
