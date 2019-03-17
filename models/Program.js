const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
// same as, this is object destructuring
// const {Schema} = mongoose
// const mongodbErrorHandler = require('mongoose-mongodb-errors');

const ProgramSchema = new mongoose.Schema({
  title: String,
  description: String,
  dateStart: Date,
  dateEnd: Date,
  type: { type: mongoose.Schema.ObjectId, ref: 'ProgramType' },
  admins: { type: mongoose.Schema.ObjectId, ref: 'User' },
});

//this creates a model class
const Program = mongoose.model('Program', ProgramSchema);
module.exports = Program;
