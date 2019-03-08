const router = require('express').Router();

//do it this way to prevent mongoose from importing several models if you are running several other files

const mongoose = require('mongoose');

// const ProgramType = mongoose.model('programtypes');

//Wes
const ProgramType = mongoose.model('ProgramType');
const User = mongoose.model('User');

//const ProgramType = require('../models/ProgramType');
router.get('/programTypes', (req, res) => {
  //  console.log('/request called', req.body);
  // console.log({ ProgramType });
  ProgramType.find().then(types => {
    // console.log('here', types);
    res.send(types);
  });
});

router.get('/users', (req, res) => {
  console.log('/request called', req.body);
  User.find().then(users => {
    console.log('user', users);
    res.send(users);
  });
});

module.exports = router;
