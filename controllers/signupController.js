const User = require('../models/User');

module.exports = {

  registerView: (req, res) => {
    res.render('signup', { css: 'signup.css' });
  },

  registerUser: async (req, res) => {
    const { name, email, password } = req.body;
    const role = 'client';

    if (!name || !email || !password) {
      return res.render('signup', { css: 'signup.css', error: 'Please fill all fields' });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.render('signup', { css: 'signup.css', error: 'A user account already exists with this email' });
    }

    try {
      await User.create({ name, email, password: bcrypt.hashSync(password, 8), role });
      return res.redirect('login?registrationdone');
    } catch (error) {
      return res.render('signup', { css: 'signup.css', error: 'Error creating user' });
    }
  },
};
