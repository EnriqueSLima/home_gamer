const express = require('express');
const tournamentController = require('../controllers/tournamentController');
const { protectRoute } = require('../auth');
const router = express.Router();

router.get('/tournament-structure', protectRoute, tournamentController.tournamentView);
router.post('/save-tournament', protectRoute, tournamentController.saveTournament);
router.get('/tournament/:id', protectRoute, tournamentController.getTournamentById);
router.post('/update-tournament', protectRoute, tournamentController.updateTournament);
router.delete('/delete-tournament/', protectRoute, tournamentController.deleteTournament);

module.exports = router;
