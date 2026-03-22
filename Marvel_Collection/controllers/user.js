const User = require('../models/user');
const router = require('express').Router();
const passport = require('passport');

const auth = require('../services/auth');

// Sign up page.

router.get('/new', (req, res) => {
  res.render('user/new');
});

// Post to create new user (params are username/password).

router.post('/',
  passport.authenticate(
    'local-signup', {
        failureRedirect: '/user/new',
        successRedirect: '/home'
    }
  )
);

// Post to login (params are username/password).

router.post('/login',
  passport.authenticate(
    'local-login', {
        failureRedirect: '/',
        successRedirect: '/home'
    }
));

// Logout.

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;