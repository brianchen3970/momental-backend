const router = require('express').Router();
let Recording = require('../models/recording.model');
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  Recording.find()
    .then(recordings => res.json(recordings))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/add').post((req, res) => {
  try {
    const username = req.body.username;
    const description = req.body.description;
    const rating = Number(req.body.mood);
    const date = Date.parse(req.body.date);
    
    const newRecording = new Recording({
        username,
        description, 
        rating, 
        date,
      });

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