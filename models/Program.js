const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
// same as, this is object destructuring
// const {Schema} = mongoose
// const mongodbErrorHandler = require('mongoose-mongodb-errors');

const ProgramSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: [{ type: mongoose.Schema.ObjectId, ref: 'ProgramType' }],
});

//this creates a model class
const Program = mongoose.model('Program', ProgramSchema);
module.exports = Program;
