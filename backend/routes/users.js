const router = require('express').Router();
const fs = require('fs');
let User = require('../models/user.model');
const filePath = "/Users/arnav/Desktop/momental/frontend/build";



router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;

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

function findUser(name) {
  return User.find({username: name});
}

router.route('/:username/addFriend').post((req, res) => {
  var friendToAdd = req.body.friend;
  findUser(req.params.username).friends.push(friendToAdd);
  
});

module.exports = router;