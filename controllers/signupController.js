const Users = require('../models/Users');
const bcrypt = require('bcryptjs');

module.exports = {

  registerView: (req, res) => {
    res.render('signup', { css: 'signup.css' });
  },

  registerUser: async (req, res) => {
    const { name, email, password } = req.body;
    const role = 'client';

    if (!name || !email || !password) {
      return res.render('signup', {
        css: 'signup.css',
        error: 'Please fill all fields'
      });
    }

    const user = await Users.findOne({ where: { email } });
    if (user) {
      return res.render('signup', {
        css: 'signup.css',
        error: 'A user account already exists with this email'
      });
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 8);
      const userData = { name, email, password: hashedPassword, role };
      const user = await Users.create(userData);
      console.log(`User created: ${user.id}`);
      return res.redirect('login?registrationdone');
    } catch (error) {
      console.error(`Error creating user: ${error}`);
      return res.render('signup', {
        css: 'signup.css',
        error: 'Error creating user'
      });
    }
  },
};
