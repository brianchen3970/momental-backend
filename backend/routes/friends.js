const router = require('express').Router();
let Recording = require('../models/recording.model');
let User = require('../models/user.model');

router.route('/:username').get((req, res) => {
  var actUser = {username: req.params.username};
  var friendsList = actUser.friends;
  var query = {username: {$in: friendsList}};
    User.find(query)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;