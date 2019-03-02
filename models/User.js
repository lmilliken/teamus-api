const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// same as, this is object destructuring
// const {Schema} = mongoose

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  providedId: String,
  provider: String,
  nameFirst: String,
  nameLast: String,
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Email address is invalid.'],
    required: 'Email address is required',
  },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

//this creates a model class
module.exports = mongoose.model('User', userSchema);
