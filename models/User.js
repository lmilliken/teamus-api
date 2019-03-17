const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// same as, this is object destructuring
// const {Schema} = mongoose

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  active: {
    type: Boolean,
    default: false,
  },
  authMethod: String,
  agreedToTerms: Boolean,
  providedId: String,
  provider: String,
  nameFirst: String,
  nameLast: String,
  password: String,
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Email address is invalid.'],
    required: 'Email address is required',
  },
  emailVerificationToken: String,
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
});

// userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

userSchema.methods.verifyPassword = async function(password) {
  const user = this;
  console.log('password', password);
  if (user.password === password) {
    console.log('passwords match');
    return user;
  }

  console.log('NO PASSWORD MATCH');
  return false;
};

//this creates a model class
module.exports = mongoose.model('User', userSchema);
