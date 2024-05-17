const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = {
  // index view
  indexView: (req, res) => {
    res.render('index', { css: 'index.css' })
  },

  // signup view
  registerView: (req, res) => {
    res.render('signup', { css: 'signup.css' })
  },

  registerUser: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.render('signup', { css: 'signup.css', error: 'Please fill all fields' });
    }

    if (await User.findOne({ where: { email } })) {
      return res.render('signup', { css: 'signup.css', error: 'A user account already exists with this email' });
    }

    await User.create({ name, email, password: bcrypt.hashSync(password, 8) });

    res.redirect('login?registrationdone');
  },

  //  login/out views
  loginView: (req, res) => {
    res.render('login', { css: 'login.css' })
  },

  loginUser: (req, res) => {
    // TODO: complete
    res.redirect('login');
  },

  logoutUser: (req, res) => {
    // TODO: complete
    res.redirect('login');
  },

  // display views
  displayView: (req, res) => {
    res.render('display',
      {
        css: 'display.css',
        js: 'display.js'
      })
  },
  tournamentView: (req, res) => {
    res.render('tournament-settings',
      {
        css: 'tournament-settings.css',
        js: 'tournament-settings.js'
      })
  },
  playerView: (req, res) => {
    res.render('player-settings',
      {
        css: 'player-settings.css',
        js: 'player-settings.js'
      })
  }
}


