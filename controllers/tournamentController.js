const tournamentService = require('../services/tournamentService');

module.exports = {
  tournamentView: async (req, res) => {
    try {
      const activeTournament = await tournamentService.getActiveTournament();

      if (!activeTournament) {
        return res.render('tournament-structure', {
          css: 'tournament-structure.css',
          js: 'tournament-structure.js',
          user: req.user,
          formHidden: true,
          error: 'No active tournaments available'
        });
      }

      res.render('tournament-structure', {
        css: 'tournament-structure.css',
        js: 'tournament-structure.js',
        user: req.user,
        levels: activeTournament.Levels,
        tournament: {
          buyin_money: activeTournament.buyin_money,
          buyin_chips: activeTournament.buyin_chips,
          rebuy_money: activeTournament.rebuy_money,
          rebuy_chips: activeTournament.rebuy_chips,
          addon_money: activeTournament.addon_money,
          addon_chips: activeTournament.addon_chips
        }
      });
    } catch (error) {
      console.error('Error fetching active tournament:', error);
      res.status(500).json({ error: 'Error fetching active tournament' });
    }
  },

  saveTournament: async (req, res) => {
    try {
      const tournament = await tournamentService.createTournament(req.body);
      res.redirect(`/tournament/${tournament.id}`);
    } catch (error) {
      console.error('Failed to save tournament:', error);
      res.status(500).json({ error: 'Failed to save tournament' });
    }
  },

  getTournamentById: async (req, res) => {
    const { id } = req.params;

    try {
      const tournament = await tournamentService.getTournamentById(id);

      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      res.render('tournament-structure', {
        css: 'tournament-structure.css',
        js: 'tournament-structure.js',
        user: req.user,
        levels: tournament.Levels,
        tournament: {
          buyin_money: tournament.buyin_money,
          buyin_chips: tournament.buyin_chips,
          rebuy_money: tournament.rebuy_money,
          rebuy_chips: tournament.rebuy_chips,
          addon_money: tournament.addon_money,
          addon_chips: tournament.addon_chips
        }
      });
    } catch (error) {
      console.error('Error fetching tournament by ID:', error);
      res.status(500).json({ error: 'Error fetching tournament' });
    }
  },

  updateTournament: async (req, res) => {
    console.log('UPDATE TOURNAMENT');
    try {
      const activeTournament = await tournamentService.getActiveTournament();

      if (!activeTournament) {
        return res.status(404).json({ error: 'No active tournaments available' });
      }

      const updatedTournament = await tournamentService.updateTournament(activeTournament.id, req.body);
      res.redirect(`/tournament/${updatedTournament.id}`);
    } catch (error) {
      console.error('Failed to update tournament:', error);
      res.status(500).json({ error: 'Failed to update tournament' });
    }
  },

  deleteTournament: async (req, res) => {
    const activeTournament = await tournamentService.getActiveTournament();

    if (!activeTournament) {
      return res.status(404).json({ error: 'No active tournaments available' });
    }

    try {
      await tournamentService.deleteTournament(activeTournament.id);
      res.redirect('/tournament-structure');
    } catch (error) {
      console.error('Failed to delete tournament:', error);
      res.status(500).json({ error: 'Failed to delete tournament' });
    }
  }
};
