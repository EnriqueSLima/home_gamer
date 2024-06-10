const express = require('express');
const authController = require('../controllers/auth');
const { protectRoute, authorizeRoles } = require('../auth');
const Tournament = require('../models/Tournament');
const Level = require('../models/Level');
const User = require("../models/User");
const router = express.Router();

// index route
router.get('/', authController.indexView);

// signup routes
router.get('/signup', protectRoute, authorizeRoles('admin', 'manager'), authController.registerView);
router.post('/signup', protectRoute, authorizeRoles('admin', 'manager'), authController.registerUser);

// admin signup route
router.post('/create-admin', protectRoute, authorizeRoles('admin'), authController.createAdminUser);

// manage users routes
router.get('/manage-users', protectRoute, authorizeRoles('admin', 'manager'), authController.manageUsersView);
router.post('/manage-users', protectRoute, authorizeRoles('admin', 'manager'), authController.manageUsers);
router.get('/manage-users/search', protectRoute, authorizeRoles('admin', 'manager'), authController.searchUsers);
router.post('/manage-users/delete', async (req, res) => {
  const { userId } = req.body;
  try {
    await User.destroy({ where: { id: userId } });
    res.redirect('/manage-users'); // Redirect back to the manage-users page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
});

// login/out routes
router.get('/login', authController.loginView);
router.get('/logout', authController.logoutUser);
router.post('/login', authController.loginUser);

// display routes
router.get('/display', protectRoute, authController.displayView);
router.get('/tournament-settings', protectRoute, authController.tournamentView);
router.get('/player-settings', protectRoute, authController.playerView);

// admin routes
router.get('/admin', protectRoute, authorizeRoles('admin'), authController.adminView);

router.post('/tournament-settings', async (req, res) => {
  const {
    buyin_money, buyin_chips, rebuy_money, rebuy_chips, addon_money, addon_chips,
    levels // Assume levels is an array of objects with duration, small_blind, and big_blind
  } = req.body;

  try {
    const tournament = await Tournament.create({
      buyin_money,
      buyin_chips,
      rebuy_money,
      rebuy_chips,
      addon_money,
      addon_chips
    });

    for (const level of levels) {
      await Level.create({
        duration: level.duration,
        small_blind: level.small_blind,
        big_blind: level.big_blind,
        tournamentId: tournament.id
      });
    }

    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Failed to save settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});
module.exports = router;
