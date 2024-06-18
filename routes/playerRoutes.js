const express = require('express');
const playerController = require('../controllers/playerController');
const { protectRoute, authorizeRoles } = require('../auth');
const router = express.Router();

router.get('/player-settings', protectRoute, playerController.playerView);
router.post('/add-player', protectRoute, playerController.addPlayer);
router.post('/search-player', protectRoute, playerController.searchPlayer);

module.exports = router;
