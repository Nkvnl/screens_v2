var User = require('../models/user');
module.exports = {

isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      res.redirect('/');
      // req.flash('error', 'Je hebt niet de juiste toestemming voor deze pagina');
    }
  }
}