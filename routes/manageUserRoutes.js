const express = require('express');
const manageUsersController = require('../controllers/manageUsersController');
const { protectRoute, authorizeRoles } = require('../auth');
const router = express.Router();

router.get('/manage-users', protectRoute, authorizeRoles('admin', 'manager'), manageUsersController.manageUsersView);
router.post('/manage-users', protectRoute, authorizeRoles('admin', 'manager'), manageUsersController.manageUsers);
router.get('/manage-users/search', protectRoute, authorizeRoles('admin', 'manager'), manageUsersController.searchUsers);
router.post('/manage-users/delete', protectRoute, authorizeRoles('admin', 'manager'), manageUsersController.deleteUser);

module.exports = router;
