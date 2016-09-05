var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET about page. */
router.get('/', function(req, res, next) {
  var file = fs.readFileSync('./file','utf8');
  var data = JSON.parse(file);
  var count = data.devices.length;
  res.render('index', {title:'Home Page', deviceNum:count, output:data});
});



module.exports = router;
