const passport = require('passport');
const { generateToken } = require('../auth.js');

module.exports = {
  loginView: (req, res) => {
    res.render('login', { css: 'login.css' });
  },

  loginUser: (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.redirect('/login?error');
      }
      const token = generateToken(user);
      res.cookie('jwtToken', token, { httpOnly: true });
      res.redirect('/display');
    })(req, res, next);
  },

  logoutUser: (req, res) => {
    res.clearCookie('jwtToken');
    res.redirect('login');
  }
};
