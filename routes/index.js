const express = require('express');
const router = express.Router();

// Index
router.use('/', require('./indexRoutes'));

// Sign up
router.use('/', require('./signupRoutes'));

// Login
router.use('/', require('./loginRoutes'));

// Tournament
router.use('/', require('./tournamentRoutes'));

// Manage Users
router.use('/', require('./manageUserRoutes'));

// Display
router.use('/', require('./displayRoutes'));

// Player
router.use('/', require('./playerRoutes'));

// Create admin
router.use('/', require('./createAdminRoutes'));

module.exports = router;
