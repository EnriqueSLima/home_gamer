const express = require('express');
const createAdminController = require('../controllers/createAdminController');
const { protectRoute, authorizeRoles } = require('../auth');
const router = express.Router();

router.post('/create-admin', protectRoute, authorizeRoles('admin'), createAdminController.createAdminUser);

module.exports = router;
