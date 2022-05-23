const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const friends = req.body.friends;

  const newUser = new User({username, friends});

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/findUser/:username').get((req, res) => {
  var query = {username: req.params.username};
  User.find(query)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/findFriends/:username').get((req, res) => {
  var query = {username: req.params.username};
  User.find(query, {'_id': 0, 'friends': 1})
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;