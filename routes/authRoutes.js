const router = require('express').Router();
const passport = require('passport');
const passportSetup = require('../utils/passportSetup');

const redirectDomain =
  process.env.NODE_ENV === 'production'
    ? 'https://open-vista-dev.herokuapp.com'
    : 'http://localhost:3000';

//do it this way to prevent mongoose from importing several models if you are running several other files

const mongoose = require('mongoose');
const User = mongoose.model('User');

const jwt = require('jwt-simple');
const config = require('../config');

//middleware to make sure that user submitted correct token
const requireAuth = passport.authenticate('jwt', { session: false });
router.get('/test', requireAuth, (req, res) => {
  res.send('/auth/test is workin');
});

router.get('/current_user', requireAuth, (req, res) => {
  console.log('request headers: ', req.headers);
  // const user = jwt.decode(req.query.token, config.JWT_SECRET);
  console.log('current user: ', req.user);
  res.send(req.user);
});

//middleware
const requireSignin = passport.authenticate('local', { session: false });
router.post('/login', requireSignin, (req, res, next) => {
  //user already had their email and password authorized with the requireSignin middleware, we just need to give them a token
  console.log('/loging request', req.user);

  res.send({ user: req.user, token: tokenForUser(req.user) });
  //req.user is provided from the localLogin strategy's return done(null, user) in passportSetup.js
});

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  //sub = subject; iat: issued at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.JWT_SECRET);
}

router.post('/register', async (req, res) => {
  //1. validating...currently not working, tied to app.use(expressValidator);
  // req.stizeBody('firstName');ani
  // req.checkBody('firstName', 'First name is required.').notEmpty();
  // req.sanitizeBody('lastName');
  // req.checkBody('lastName', 'Last name is required.').notEmpty();
  // req.checkBody('email', 'Email is not valid.').isEmail();
  // req.sanitizeBody('email').normalizeEmail({
  //   remove_dots: false,
  //   remove_extension: false,
  //   gmail_remove_subaddress: false
  // });
  // req.checkBody('password', 'Password cannot be blank.').notEmpty();
  // req
  //   .checkBody('password-confirm', 'Confirmed password cannot be blank.')
  //   .notEmpty();
  // req
  //   .checkBody('password-confirm', 'Password do not match.')
  //   .equals(req.body.password);

  // const errors = req.validationErrors();
  // if (errors) {
  //   //    req.flash message...
  //   //do something
  //   //return...
  // }
  //check to see if email already exists
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    return res.status(422).send({ error: 'Choose another email.' });
  }
  //2. registering
  const newUser = new User({
    email: req.body.email,
    nameFirst: req.body.firstName,
    nameLast: req.body.lastName,
    password: req.body.password
  });

  newUser
    .save()
    .then(res.send({ user: newUser, token: tokenForUser(newUser) }));
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
    //console.log('in google callback, domain: ', req);
    //res.send('in /google/callback');
    //res.send({ token: tokenForUser(req.user) });
    //res.redirect(...);
    res.redirect(redirectDomain + '?token=' + tokenForUser(req.user));
  }
);

router.get('/logout', (req, res) => {
  req.logOut();
  console.log('user logged out');
  res.redirect('/');
});

module.exports = router;
