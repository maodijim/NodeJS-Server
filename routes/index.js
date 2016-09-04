var express = require('express');
var router = express.Router();
const exec = require('child_process');
var fs = require('fs');


var file = fs.readFileSync('./file','utf8');
var data = JSON.parse(file);
var count = data.devices.length;

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('index', {title:'Home Page', deviceNum:count, output:data});
});

module.exports = router;
