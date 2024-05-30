const express = require('express');
const exphbs = require('express-handlebars');
const authRoutes = require('./routes/auth.js');
const db = require('./models/db.js');
const passport = require('passport');
const { init: initAuth } = require('./auth');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

// Define custom Handlebars helpers
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: {
    eq: (a, b) => a === b,
  }
});

// Sets handlebars as default viewing engine and default layout to main.hbs
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Sets the views directory as default
app.set('views', './views/');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

initAuth();
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Used to serve static files
app.use(express.static('public'));

app.use('/', authRoutes);

// Sync database and then start the server
db.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log(`Home gamer app listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
