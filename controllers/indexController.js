module.exports = {
  indexView: (req, res) => {
    res.render('index', { css: 'index.css' });
  }
};
