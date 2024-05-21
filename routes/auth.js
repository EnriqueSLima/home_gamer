const express = require('express');
const authController = require('../controllers/auth');
const { protectRoute } = require('../auth');

const router = express.Router();
// index route
router.get('/', authController.indexView);

// signup routes
router.get('/signup', authController.registerView);
router.post('/signup', authController.registerUser);

// login/out routes
router.get('/login', authController.loginView);
router.get('/logout', authController.logoutUser);
router.post('/login', authController.loginUser);

// display routes
router.get('/display', protectRoute, authController.displayView);

router.get('/tournament-settings', protectRoute, authController.tournamentView);
router.get('/player-settings', protectRoute, authController.playerView);
module.exports = router;
