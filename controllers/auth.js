const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Level = require('../models/Level');
const passport = require('passport');
const { generateToken } = require('../auth.js');
const { Op } = require('sequelize');

module.exports = {

  // signup view

  adminView: (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }
    res.render('admin', { css: 'admin.css' });
  },

};
