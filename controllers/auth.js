const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Level = require('../models/Level');
const passport = require('passport');
const { generateToken } = require('../auth.js');
const { Op } = require('sequelize');

module.exports = {
  // index view
  indexView: (req, res) => {
    res.render('index', { css: 'index.css' });
  },

  // signup view
  registerView: (req, res) => {
    res.render('signup', { css: 'signup.css' });
  },

  registerUser: async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.render('signup', { css: 'signup.css', error: 'Please fill all fields' });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.render('signup', { css: 'signup.css', error: 'A user account already exists with this email' });
    }

    // Allow only admins to register managers and managers to register clients
    if ((req.user.role === 'admin' && role === 'manager') || (req.user.role === 'manager' && role === 'client')) {
      await User.create({ name, email, password: bcrypt.hashSync(password, 8), role });
      return res.redirect('login?registrationdone');
    } else {
      return res.render('signup', { css: 'signup.css', error: 'Unauthorized role assignment' });
    }
  },

  createAdminUser: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ error: 'A user account already exists with this email' });
    }

    try {
      await User.create({ name, email, password: bcrypt.hashSync(password, 8), role: 'admin' });
      res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error creating admin user' });
    }
  },

  manageUsersView: async (req, res) => {
    try {
      const users = await User.findAll(); // Get users

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

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.render('manage-users', { css: 'manage-users.css', error: 'A user account already exists with this email' });
    }

    if (req.user.role !== 'admin') {
      return res.render('manage-users', { css: 'manage-users.css', error: 'Only admins can manage users' });
    }

    try {
      await User.create({ name, email, password: bcrypt.hashSync(password, 8), role });
      res.redirect('/manage-users?created');
    } catch (error) {
      res.render('manage-users', { css: 'manage-users.css', error: 'Error creating user' });
    }
  },

  searchUsers: async (req, res) => {
    const { query } = req.query;

    try {
      const users = await User.findAll({
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
      await User.destroy({ where: { id: userId } });
      res.redirect('/manage-users'); // Redirect back to the manage-users page
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting user');
    }
  },

  loginView: (req, res) => {
    res.render('login', { css: 'login.css' });
  },

  loginUser: (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.redirect('/login?error');
      }
      const token = generateToken(user);
      res.cookie('jwtToken', token, { httpOnly: true }); // Set HttpOnly cookie
      res.redirect('/display');
    })(req, res, next);
  },

  logoutUser: (req, res) => {
    res.clearCookie('jwtToken');
    res.redirect('login');
  },

  displayView: (req, res) => {
    res.render('display', {
      css: 'display.css',
      js: 'display.js',
      user: req.user
    });
  },

  tournamentView: (req, res) => {
    res.render('tournament-settings', {
      css: 'tournament-settings.css',
      js: 'tournament-settings.js',
      user: req.user
    });
  },

  playerView: (req, res) => {
    res.render('player-settings', {
      css: 'player-settings.css',
      js: 'player-settings.js',
      user: req.user
    });
  },

  adminView: (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }
    res.render('admin', { css: 'admin.css' });
  },

  saveTournament: async (req, res) => {
    const {
      buyin_money, buyin_chips, rebuy_money, rebuy_chips, addon_money, addon_chips,
      levels // Assume levels is an array of objects with duration, small_blind, and big_blind
    } = req.body;

    try {
      const tournament = await Tournament.create({
        buyin_money,
        buyin_chips,
        rebuy_money,
        rebuy_chips,
        addon_money,
        addon_chips
      });

      for (const level of levels) {
        await Level.create({
          duration: level.duration,
          small_blind: level.small_blind,
          big_blind: level.big_blind,
          tournamentId: tournament.id
        });
      }

      res.json({ message: 'Tournament saved successfully', tournamentId: tournament.id });
    } catch (error) {
      console.error('Failed to save tournament:', error);
      res.status(500).json({ error: 'Failed to save tournament' });
    }
  }
};
