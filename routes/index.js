var express = require('express');
var router = express.Router();
var fs = require('fs');
var functions = require('../functions');




/* GET Index page. */
router.get('/', function(req, res, next) {
  functions.checkFile();
  var file = fs.readFileSync('./file','utf8');
  var data = JSON.parse(file);
  var count = data.devices.length;
  res.render('index', {title:'Home Page', deviceNum:count, output:data});
});



module.exports = router;
