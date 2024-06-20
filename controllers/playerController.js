const playerService = require('../services/playersService')
const tournamentService = require('../services/tournamentsService');
const playersTournamentsService = require('../services/playersTournamentsService');

module.exports = {

  playerView: async (req, res) => {
    console.log('playerView called');
    const activeTournament = await tournamentService.getActiveTournament();
    if (!activeTournament) {
      console.log('No active tournament found');
      res.render('player-settings', {
        css: 'player-settings.css',
        js: 'player-settings.js',
        user: req.user,
        error: 'No active tournament found'
      });
      return;
    }

    const playersIn = await playersTournamentsService.getPlayersIn(activeTournament.id);
    const playersOut = await playersTournamentsService.getPlayersOut(activeTournament.id);

    res.render('player-settings', {
      css: 'player-settings.css',
      js: 'player-settings.js',
      user: req.user,
      players_in: playersIn,
      players_out: playersOut
    });
  },

  registerPlayer: async (req, res) => {
    const { playerId, rebuys, addon } = req.body;
    try {
      await playersTournamentsService.registerPlayer(playerId, rebuys, addon);
      res.json({ success: true, message: 'Player registered successfully', redirectUrl: '/player-settings' });
    } catch (error) {
      console.error('Failed to register player:', error);
      res.status(500).json({ success: false, error: 'Failed to register player' });
    }
  },

  searchPlayer: async (req, res) => {
    const { playerName } = req.body;
    try {
      const players = await playerService.searchPlayers(playerName);
      const activeTournament = await tournamentService.getActiveTournament();
      const playersIn = await playersTournamentsService.getPlayersIn(activeTournament.id);
      const playersOut = await playersTournamentsService.getPlayersOut(activeTournament.id);
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
          players: players,
          players_in: playersIn,
          players_out: playersOut
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updatePlayer: async (req, res) => {
    const { playerId, rebuys, addon } = req.body;
    try {
      const result = await playersTournamentsService.updatePlayer(playerId, rebuys, addon);
      res.json({ success: true, message: 'Player updated successfully', redirectUrl: '/player-settings' });
    } catch (error) {
      console.error('Failed to update player:', error);
      res.status(500).json({ success: false, error: 'Failed to update player' });
    }
  },

  eliminatePlayer: async (req, res) => {
    const { playerId } = req.body;
    try {
      const activeTournament = await tournamentService.getActiveTournament();
      await playersTournamentsService.eliminatePlayer(playerId, activeTournament.id);
      res.redirect('/player-settings');
    } catch (error) {
      console.error('Error eliminating player:', error);
      res.status(500).send('Error eliminating player');
    }
  }
};
