const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// same as, this is object destructuring
// const {Schema} = mongoose
// const mongodbErrorHandler = require('mongoose-mongodb-errors');

const programTypeSchema = new Schema({
  name: String,
  description: String,
});

//this creates a model class
// mongoose.model('programtypes', programTypeSchema);

//Wes
module.exports = mongoose.model('ProgramType', programTypeSchema);
