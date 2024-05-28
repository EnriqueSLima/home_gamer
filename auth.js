const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require("./models/User");
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'hello';

module.exports = {
  init: () => {
    passport.use(
      new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await User.findOne({ where: { email } });
        if (!user) return done(null, false);
        if (!bcrypt.compareSync(password, user.password)) return done(null, false);
        return done(null, user);
      })
    );

    passport.serializeUser((user, done) => {
      ;
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    });

  },
  generateToken: (user) => {
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    return token;
  },
  protectRoute: (req, res, next) => {
    const token = req.cookies.jwtToken; // Access token from cookie
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Unauthorized' });
      req.user = decoded;
      next();
    });
  }
}
