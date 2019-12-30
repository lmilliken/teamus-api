const router = require('express').Router();
const passport = require('passport');

//do it this way to prevent mongoose from importing several models if you are running several other files

const redirectDomain =
  process.env.NODE_ENV === 'production'
    ? 'https://open-vista-dev.herokuapp.com'
    : '/';

const mongoose = require('mongoose');

const User = mongoose.model('User');

router.post('/login', (req, res) => {
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'this is a failed flash message',
    successRedirect: '/',
    successFlash: 'You are now logged in flash message '
  });
});

router.post('/register', (req, res) => {
  //1. validating...
  req.sanitizeBody('firstName');
  req.checkBody('firstName', 'First name is required.').notEmpty();
  req.sanitizeBody('lastName');
  req.checkBody('lastName', 'Last name is required.').notEmpty();
  req.checkBody('email', 'Email is not valid.').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank.').notEmpty();
  req
    .checkBody('password-confirm', 'Confirmed password cannot be blank.')
    .notEmpty();
  req
    .checkBody('password-confirm', 'Password do not match.')
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    //    req.flash message...
    //do something
    //return...
  }

  //2. registering
  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  user
    .setPassword(req.body.password)
    .then(setUser => setUser.save().then(res.send('it works')));
});

router.get('/test', (req, res) => {
  res.send('/auth/test is workin');
});

router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    console.log('in google callback, domain: ', req);
    //res.send('in /google/callback');
    res.header('x-auth', req.user.token).send();
    //res.redirect(...);
    // res.redirect(redirectDomain + '/awesome');
  }
);

router.get('/current_user', (req, res) => {
  console.log('request credentials: ', req.credentials);
  console.log('headers: ', req.headers);
  console.log('current user: ', req.user);
  res.send(req.user);
});

router.get('/logout', (req, res) => {
  req.logOut();
  console.log('user logged out');
  res.redirect('/');
});

module.exports = router;
