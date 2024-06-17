const express = require('express');
const playerController = require('../controllers/playerController');
const { protectRoute, authorizeRoles } = require('../auth');
const router = express.Router();

router.get('/player-settings', protectRoute, playerController.playerView);

module.exports = router;
