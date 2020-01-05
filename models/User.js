const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// same as, this is object destructuring
// const {Schema} = mongoose

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const config = require('../config');

const userSchema = new Schema({
  active: {
    type: Boolean,
    default: false
  },
  authMethod: String,
  agreedToTerms: Boolean,
  idGoogle: String,
  nameFirst: String,
  nameLast: String,
  password: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Email address is invalid.'],
    required: 'Email address is required'
  },
  emailVerificationToken: String,
  emailConfirmed: {
    type: Boolean,
    default: false
  }
});

//overriding method, this is what gets sent back when you refer to the "User" object.  Prevents sending password
userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

//on save hook to encrypt password
userSchema.pre('save', function(next) {
  const user = this;
  var password = user.password;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });

  // if (user.isModified('password')) {
  //   var password = user.password;

  //   bcrypt.genSalt(10, (err, salt) => {
  //     if (err) {
  //       return next(err);
  //     }

  //     bcrypt.hash(password, salt, (err, hash) => {
  //       if (err) {
  //         return next(err);
  //       }
  //       user.password = hash;
  //       next();
  //     });
  //   });
  // }
});

//instance method that we call on a specifc instance of user, not the User model
userSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt
    .sign({ _id: user._id.toHexString(), access }, config.JWT_SECRET)
    .toString();

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
};

// userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

//new Stephen, advanced React
userSchema.methods.verifyPassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

//this creates a model class
module.exports = mongoose.model('User', userSchema);
