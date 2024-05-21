const express = require('express')
//const bodyParser = require('body-parser')
const handlebars = require('express-handlebars').engine
const authRoutes = require('./routes/auth.js')
const db = require('./models/db.js');
const passport = require('passport');
const { init: initAuth } = require('./auth');
const session = require('express-session');

const app = express()
const PORT = 3000

// sets handlebars as default viewing engine and
// default layout to main.hbs
app.engine('hbs', handlebars({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

// sets the views directory as default
app.set('views', './views/');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

initAuth();
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
// used to serve static files
app.use(express.static('public'))

app.use('/', authRoutes);

db.sync({ force: false })
  .then(() => {
    app.listen(PORT, console.log(`Home gamer app listening on port ${PORT}`));
  });
