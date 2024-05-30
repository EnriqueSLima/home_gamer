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

// create user routes
router.get('/create-user', protectRoute, authorizeRoles('admin'), authController.createUserView);
router.post('/create-user', protectRoute, authorizeRoles('admin'), authController.createUser);

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
