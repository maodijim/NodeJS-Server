var express = require('express');
var router = express.Router();
var fs = require('fs');
var crypto = require("crypto");
var functions = require('../functions');

/* GET Index page. */
router.get('/', function(req, res, next) {
  var file = fs.readFileSync('./file','utf8');
  var data = JSON.parse(file);
  var id = data.id;
  var iv = crypto.randomBytes(16);
  var iv1 = iv.toString('hex');
  var uid = functions.encryt(id,iv);
  var count = data.devices.length;
  res.render('index', {title:'Home Page', deviceNum:count,output:data,uid:uid,iv:iv1});
});



module.exports = router;
