const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');

const config = require('../config');
const User = require('../models/User');
//stephen
//const User = mongoose.model('users')
//from mongoose.model('users', userSchema)

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((userID, done) => {
  User.findById(userID).then(user => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        providedId: profile.id,
        provider: 'Google',
      });

      if (existingUser) {
        //user already exists
        done(null, existingUser); //null is the error object
      } else {
        const createdUser = await new User({
          providedId: profile.id,
          provider: 'Google',
          email: profile.emails[0].value,
        }).save();

        done(null, createdUser);
      }
    },
  ),
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    function(email, password, done) {
      User.findOne({ email: email }, async function(err, user) {
        // console.log('user in password local: ', user);
        // const verified = await user.verifyPassword(password);
        // console.log('verify password: ', verified);
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!(await user.verifyPassword(password))) {
          console.log('passwords do not match');
          // throw Error('invalid credentials');
          return done(null, false);
        }
        return done(null, user);
      });
    },
  ),
);
