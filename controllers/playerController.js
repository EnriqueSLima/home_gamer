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

    console.log(`PLAYERS IN ${playersIn}`);
    console.log(`PLAYERS OUT ${playersOut}`);
    console.log('Rendering player-settings with players_in and players_out');
    res.render('player-settings', {
      css: 'player-settings.css',
      js: 'player-settings.js',
      user: req.user,
      players_in: playersIn,
      players_out: playersOut
    });
  },

  registerPlayer: async (req, res) => {
    const { playerId, rebuy, addon } = req.body;

    try {
      const result = await playersTournamentsService.registerPlayer(playerId, rebuy, addon);
      res.json(result);
    } catch (error) {
      console.error('Failed to register player:', error);
      res.status(500).json({ error: 'Failed to register player' });
    }
  },

  searchPlayer: async (req, res) => {
    const { playerName } = req.body;
    try {
      const players = await playerService.searchPlayers(playerName);
      const activeTournament = await tournamentService.getActiveTournament();
      const playersIn = await playersTournamentsService.getPlayersIn(activeTournament.id);
      const playersOut = await playersTournamentsService.getPlayersOut(activeTournament.id);
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
