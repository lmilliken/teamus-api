const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
// same as, this is object destructuring
// const {Schema} = mongoose
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const RequestSchema = new mongoose.Schema({
  title: String,
  typeOfRequest: { type: mongoose.Schema.ObjectId, ref: 'ExpertArea' },
  status: { type: mongoose.Schema.ObjectId, ref: 'RequestStatus' },
  description: String
});

//this creates a model class
const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;
