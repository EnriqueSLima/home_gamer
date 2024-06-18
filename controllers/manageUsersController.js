const bcrypt = require('bcryptjs');
const Users = require('../models/Users');
const { Op } = require('sequelize');

module.exports = {

  manageUsersView: async (req, res) => {
    try {
      const users = await Users.findAll(); // Get users

      res.render('manage-users', {
        css: 'manage-users.css',
        user: req.user
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving users');
    }
  },

  manageUsers: async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.render('manage-users', { css: 'manage-users.css', error: 'Please fill all fields' });
    }

    const user = await Users.findOne({ where: { email } });
    if (user) {
      return res.render('manage-users', { css: 'manage-users.css', error: 'A user account already exists with this email' });
    }

    if (req.user.role !== 'admin') {
      return res.render('manage-users', { css: 'manage-users.css', error: 'Only admins can manage users' });
    }

    try {
      await Users.create({ name, email, password: bcrypt.hashSync(password, 8), role });
      res.redirect('/manage-users?created');
    } catch (error) {
      res.render('manage-users', { css: 'manage-users.css', error: 'Error creating user' });
    }
  },

  searchUsers: async (req, res) => {
    const { query } = req.query;

    try {
      const users = await Users.findAll({
        where: {
          // Search for users whose name or email contains the query string
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } }
          ]
        }
      });

      res.render('manage-users', {
        css: 'manage-users.css',
        user: req.user,
        users
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error searching users');
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.body;
    try {
      await Users.destroy({ where: { id: userId } });
      res.redirect('/manage-users'); // Redirect back to the manage-users page
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting user');
    }
  },
};
