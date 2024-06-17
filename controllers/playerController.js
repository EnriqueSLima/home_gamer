
module.exports = {

  playerView: (req, res) => {
    res.render('player-settings', {
      css: 'player-settings.css',
      js: 'player-settings.js',
      user: req.user
    });
  },

};
