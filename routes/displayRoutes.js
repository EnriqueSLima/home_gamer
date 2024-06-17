const express = require('express');
const displayController = require('../controllers/displayController');
const { protectRoute, authorizeRoles } = require('../auth');
const router = express.Router();

router.get('/display', protectRoute, displayController.displayView);

module.exports = router;
