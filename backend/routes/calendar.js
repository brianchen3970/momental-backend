const router = require('express').Router();
let Recording = require('../models/recording.model');
let User = require('../models/user.model');

router.route('/:username').get((req, res) => {
  var query = {username: req.params.username};
    Recording.find(query)
    .then(recordings => res.json(recordings))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;