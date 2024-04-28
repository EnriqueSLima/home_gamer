const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars').engine
const home_gamer = express()
const port = 3000

// sets handlebars as default viewing engine and
// default layout to main.hbs
home_gamer.engine('hbs', handlebars({ defaultLayout: 'main', extname: 'hbs' }));
home_gamer.set('view engine', 'hbs');

// sets the views directory as default
home_gamer.set('views', './views/');

// used to serve static files
home_gamer.use(express.static('public'))

home_gamer.get('/', (req, res) => {
  res.render('index', { css: 'index.css' })
})

home_gamer.get('/login', (req, res) => {
  res.render('login', { css: 'login.css' })
})

home_gamer.get('/display', (req, res) => {
  res.render('display', { css: 'display.css' })
})
home_gamer.get('/signup', (req, res) => {
  res.render('signup', { css: 'signup.css' })
})

home_gamer.listen(port, () => {
  console.log(`Home gamer app listening on port ${port}`)
})
