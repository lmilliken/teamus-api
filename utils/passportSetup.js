const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');

const config = require('../config');
const User = require('../models/User');
//stephen
//const User = mongoose.model('users')
//from mongoose.model('users', userSchema)

//cookies method; only works on same-domain
// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((userID, done) => {
//   User.findById(userID).then(user => done(null, user));
// });

//1. create local strategy, this is used when user logs in to verify that email and password exist
const localOptions = {
  usernameField: 'email'
};
const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  User.findOne({ email: email }, function(err, user) {
    // console.log('user in password local: ', user);
    // const verified = await user.verifyPassword(password);
    // console.log('verify password: ', verified);
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    user.verifyPassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});
passport.use(localLogin);

//1. set up options of JWT Strategy, this is used to for middleware to make sure that request is authorized (verifying that they have a valid token, "decoding" the jwt that came with the request)
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET
};
//2. create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //check if userID in payload exists in database
  console.log('payload:', payload);
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
//3. tell passport to this JWT strategy
passport.use(jwtLogin);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        $or: [{ idGoogle: profile.id }, { email: profile.emails[0].value }]
      });

      if (existingUser) {
        //user already exists
        return done(null, existingUser);
      } else {
        const createdUser = await new User({
          idGoogle: profile.id,
          email: profile.emails[0].value
        }).save();
        return done(null, createdUser);
      }
    }
  )
);

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'email'
//     },
//     function(email, password, done) {
//       User.findOne({ email: email }, async function(err, user) {
//         // console.log('user in password local: ', user);
//         // const verified = await user.verifyPassword(password);
//         // console.log('verify password: ', verified);
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           return done(null, false);
//         }
//         if (!(await user.verifyPassword(password))) {
//           console.log('passwords do not match');
//           // throw Error('invalid credentials');
//           return done(null, false);
//         }
//         return done(null, user);
//       });
//     }
//   )
// );
