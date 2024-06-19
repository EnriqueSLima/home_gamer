const express = require('express');
const playerController = require('../controllers/playerController');
const { protectRoute } = require('../auth');
const router = express.Router();

router.get('/player-settings', protectRoute, playerController.playerView);
router.post('/search-player', protectRoute, playerController.searchPlayer);
router.post('/register-player', protectRoute, playerController.registerPlayer);
router.post('/eliminate-player', protectRoute, playerController.eliminatePlayer);
router.post('/update-player', protectRoute, playerController.updatePlayer);

module.exports = router;
