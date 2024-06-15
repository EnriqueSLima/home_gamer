const express = require('express');
const authController = require('../controllers/auth');
const { protectRoute, authorizeRoles } = require('../auth');
const router = express.Router();

// Index route
router.get('/', authController.indexView);

// Signup routes
router.get('/signup', authController.registerView);
router.post('/signup', authController.registerUser);

// Admin signup route
router.post('/create-admin', protectRoute, authorizeRoles('admin'), authController.createAdminUser);

// Manage users routes
router.get('/manage-users', protectRoute, authorizeRoles('admin', 'manager'), authController.manageUsersView);
router.post('/manage-users', protectRoute, authorizeRoles('admin', 'manager'), authController.manageUsers);
router.get('/manage-users/search', protectRoute, authorizeRoles('admin', 'manager'), authController.searchUsers);
router.post('/manage-users/delete', protectRoute, authorizeRoles('admin', 'manager'), authController.deleteUser);

// Login/Logout routes
router.get('/login', authController.loginView);
router.get('/logout', authController.logoutUser);
router.post('/login', authController.loginUser);

// Display routes
router.get('/display', protectRoute, authController.displayView);
router.get('/tournament-structure', protectRoute, authController.tournamentView);
router.get('/player-settings', protectRoute, authController.playerView);

// Admin routes
router.get('/admin', protectRoute, authorizeRoles('admin'), authController.adminView);

// Tournaments route
router.post('/save-tournament', protectRoute, authController.saveTournament);
router.get('/tournament/:id', protectRoute, authController.getTournamentById);
router.post('/update-tournament/:id', protectRoute, authController.updateTournament);
router.delete('/delete-tournament/:id', protectRoute, authController.deleteTournament);

module.exports = router;
