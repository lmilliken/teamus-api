const router = require('express').Router();

//do it this way to prevent mongoose from importing several models if you are running several other files

const mongoose = require('mongoose');

// const ProgramType = mongoose.model('programtypes');

//Wes
const Program = mongoose.model('Program');
const User = mongoose.model('User');

//const ProgramType = require('../models/ProgramType');
router.post('/programs/new', (req, res) => {
  //  console.log('/request called', req.body);
  // console.log({ ProgramType });
  console.log('programs/new', req.body);
  const program = new Program(req.body);

  program
    .save()
    .then(savedProgram => res.send(savedProgram))
    .catch(e => console.log(e));
});

router.get('/programs', (req, res) => {
  //  console.log('/request called', req.body);
  // console.log({ ProgramType });
  console.log('programs', req.body);

  Program.find({})
    .populate('type')
    .then(programs => res.send(programs))
    .catch(e => console.log({ e }));
});

module.exports = router;
