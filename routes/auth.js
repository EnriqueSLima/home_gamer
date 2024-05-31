const express = require('express');
const authController = require('../controllers/auth');
const { protectRoute, authorizeRoles } = require('../auth');

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
router.get('/manage-users', protectRoute, authorizeRoles('admin'), authController.manageUsersView);
router.post('/manage-users', protectRoute, authorizeRoles('admin'), authController.manageUsers);
router.get('/manage-users/search', protectRoute, authorizeRoles('admin'), authController.searchUsers);
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

module.exports = router;
