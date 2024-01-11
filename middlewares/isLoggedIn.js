const User = require('../model/userModel');

const requireAuth = (req, res, next) => {
  if (req.session.user) {
    // User is authenticated, continue to the next middleware
    next();
  } else {
    res.redirect('/login');
  }
};


module.exports = { requireAuth };