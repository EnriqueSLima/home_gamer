module.exports = {

  displayView: (req, res) => {
    res.render('display', {
      css: 'display.css',
      js: 'display.js',
      user: req.user
    });
  },
};
