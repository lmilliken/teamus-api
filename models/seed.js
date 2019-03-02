const config = require('../config');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

mongoose.connect(config.mongodb.dbURI, { useNewUrlParser: true });

//Wes
const ProgramType = require('./ProgramType');
const programTypes = [
  {
    name: 'Simple Award',
    description: 'Simple submission, review, and scoring process.',
  },
  {
    name: 'Abstract Collection',
    description: 'Abstract proposal and review process.',
  },
];
// ProgramType.deleteMany({})
//   .then(
//     ProgramType.insertMany(programTypes).then(stuff =>
//       console.log('inserted', stuff),
//     ),
//   )
//   .then(() => console.log('deleted'))
//   .catch(err => console.log(err));

const User = require('./User');
const users = [
  {
    nameFirst: 'AdminF',
    nameLast: 'Admin',
    email: 'laurel.milliken@colostate.edu',
  },
];
User.deleteMany({})
  .then(User.insertMany(users).then(stuff => console.log('inserted', stuff)))
  .catch(err => console.log(err));
