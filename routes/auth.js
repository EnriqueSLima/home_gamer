const express = require('express');
const authController = require('../controllers/auth');

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
router.get('/display', authController.displayView);

router.get('/tournament-settings', authController.tournamentView);
router.get('/player-settings', authController.playerView);
module.exports = router;
