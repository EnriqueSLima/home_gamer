const express = require('express');
const authController = require('../controllers/auth');
const { protectRoute, authorizeRoles } = require('../auth');
const router = express.Router();

// Admin routes
router.get('/admin', protectRoute, authorizeRoles('admin'), authController.adminView);

module.exports = router;
