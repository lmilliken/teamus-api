const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// same as, this is object destructuring
// const {Schema} = mongoose

const RequestStatus = new Schema({
  name: String
});

//this creates a model class
module.exports = mongoose.model('requeststatuses', RequestStatus);
