const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const { generateToken } = require('../auth.js');

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

  createUserView: (req, res) => {
    res.render('create-user', { css: 'create-user.css' });
  },

  createUser: async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.render('create-user', { css: 'create-user.css', error: 'Please fill all fields' });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.render('create-user', { css: 'create-user.css', error: 'A user account already exists with this email' });
    }

    if (req.user.role !== 'admin') {
      return res.render('create-user', { css: 'create-user.css', error: 'Only admins can create users' });
    }

    try {
      await User.create({ name, email, password: bcrypt.hashSync(password, 8), role });
      res.redirect('/create-user?created');
    } catch (error) {
      res.render('create-user', { css: 'create-user.css', error: 'Error creating user' });
    }
  },

  // login view
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

  // display views
  displayView: (req, res) => {
    res.render('display', { css: 'display.css', js: 'display.js', user: req.user });
  },
  tournamentView: (req, res) => {
    res.render('tournament-settings', { css: 'tournament-settings.css', js: 'tournament-settings.js' });
  },
  playerView: (req, res) => {
    res.render('player-settings', { css: 'player-settings.css', js: 'player-settings.js' });
  },

  // admin view
  adminView: (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }
    res.render('admin', { css: 'admin.css' });
  }
};
