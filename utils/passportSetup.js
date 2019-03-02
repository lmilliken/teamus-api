const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/User');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((userID, done) => {
  User.findByID(userID).then(user => done(null, user));
});

passport.use(User.createStrategy()); //from https://www.npmjs.com/package/passport-local-mongoose
