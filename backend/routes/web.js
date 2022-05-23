const router = require('express').Router();
const fs = require('fs');
let User = require('../models/user.model');
const filePath = "/Users/arnav/Desktop/momental/frontend/build";

router.route('/:filename?').get((req, res) => {
  let filename = req.params.filename;
  if (!filename || !/^[a-z0-9\.-]+$/.test(filename)) {
    filename = "index.html"
  }
  if (/^(calendar|profile|friends|recording)$/.test(filename)) {
    filename = "index.html"
  }
  console.log(filename);
  if (fs.existsSync(filePath + "/" + filename)) {
    console.log(filePath + "/" + filename);
    res.sendFile(filePath + "/" + filename);
  } 
  else {
    res.status(404);
  } 
});



router.route('/static/css/:filename').get((req, res) => {
  if (fs.existsSync(filePath + "/static/css/" + req.params.filename)) {
    res.sendFile(filePath + "/static/css/" + req.params.filename);
  } 
  else {
    res.status(404);
  } 
});

router.route('/static/js/:filename').get((req, res) => {
  if (fs.existsSync(filePath + "/static/js/" + req.params.filename)) {
    res.sendFile(filePath + "/static/js/" + req.params.filename);
  } 
  else {
    res.status(404);
  } 
});



module.exports = router;