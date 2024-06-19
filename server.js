const express = require('express');
const exphbs = require('express-handlebars');
const authRoutes = require('./routes');
const { sequelize } = require('./models/db'); // Import Sequelize instance (sequelize)
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
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
  helpers: {
    eq: (a, b) => a === b,
    or: (a, b) => a || b,
    inc: function(value) { return parseInt(value) + 1; },
    formatDate: (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    log: function(context) {
      console.log(context);
    }
  }
});

// Set handlebars as the default view engine and default layout to main.hbs
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Set the views directory as the default
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

// Serve static files
app.use(express.static('public'));

app.use('/', authRoutes);

// Sync database and then start the server
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log(`Home gamer app listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
