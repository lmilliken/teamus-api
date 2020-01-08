const config = require('../../config/dev');

const mongoose = require('mongoose');
mongoose.connect(config.mongodb.dbURI);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const ExpertArea = require('../ExpertArea');
const RequestStatus = require('../RequestStatus');

const fs = require('fs');
const areas = JSON.parse(fs.readFileSync('expertAreas.json', 'utf-8'));

// const statuses = JSON.parse(fs.readFileSync('requestStatuses.json', 'utf-8'));

console.log({ areas });
ExpertArea.insertMany(areas).then(returned => console.log('loaded', returned));

// RequestStatus.insertMany(statuses).then((returned) =>
//   console.log('loaded', returned)
// );
