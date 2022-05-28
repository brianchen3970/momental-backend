const router = require('express').Router();
let Recording = require('../models/recording.model');
let User = require('../models/user.model');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const Grid = require('gridfs-stream');
const methodOverride = require('method-override')
const crypto = require('crypto');


const connection = mongoose.connection;
const uri = process.env.ATLAS_URI;
let gfs;

connection.once('open', () => {
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('uploads');
})

const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  res.redirect('/');
});

router.get('/audio/:filename', (req, res) => {
  //console.log("here");
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    try {
      // Read output to browser
      //console.log(file);
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
      //gfs.writeFileSync("sound.m4a", buffer);
    } catch {
      res.status(404).json({
        err: 'Didnt work' //file
      });
    }
  });
});

router.route('/').get((req, res) => {
  Recording.find()
    .then(recordings => res.json(recordings))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/add').post((req, res) => {
  try {
    const username = req.body.username;
    const link = req.body.link;
    const rating = Number(req.body.mood);
    const date = Date.parse(req.body.date);
    const title = req.body.title;
    
    const newRecording = new Recording({
        username,
        link, 
        rating, 
        date,
        title
      });

    //upload.single('file');

    newRecording.save()
      .then(() => res.json('Recording added!'))
      .catch(err => res.status(400).json('Error: ' + err));
  }
  catch (e) {
    console.log(e);
    res.status(400).json('Error: ' + e);
  }
});

router.route('/calendar/:username').get((req, res) => {
    var query = {username: req.params.username};
    Recording.find(query)
    .then(recordings => res.json(recordings))
    .catch(err => res.status(400).json('Error: ' + err));

});

router.route('/:id').get((req, res) => {
    Recording.findById(req.params.id)
        .then(recording => res.json(recording))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Recording.findByIdAndDelete(req.params.id)
        .then(() => res.json('Exercise deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

function findUser(name) {
  return User.find({username: name});
}

router.route('/findUser/:username').get((req, res) => {
  var query = {username: req.params.username};
  User.find(query)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;