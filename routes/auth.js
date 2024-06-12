const express = require('express');
const authController = require('../controllers/auth');
const { protectRoute, authorizeRoles } = require('../auth');
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
router.post('/manage-users/delete', protectRoute, authorizeRoles('admin', 'manager'), authController.deleteUser);

// login/out routes
router.get('/login', authController.loginView);
router.get('/logout', authController.logoutUser);
router.post('/login', authController.loginUser);

// display routes
router.get('/display', protectRoute, authController.displayView);
router.get('/tournament-structure', protectRoute, authController.tournamentView);
router.get('/player-settings', protectRoute, authController.playerView);

// admin routes
router.get('/admin', protectRoute, authorizeRoles('admin'), authController.adminView);

// save tournament settings route
router.post('/save-tournament', protectRoute, authController.saveTournament);

module.exports = router;
