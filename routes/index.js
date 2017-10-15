var express = require('express');
var router = express.Router();
var execSync = require('child_process').execSync;
var crypto = require("crypto");
var functions = require('../functions');
var version = "1.2.4";
/* GET Index page. */
router.get('/', function(req, res, next) {
  var file = execSync('python functions.py').toString();
  var data = JSON.parse(file);
  var id = data.id;
  var iv = crypto.randomBytes(16);
  var iv1 = iv.toString('hex');
  var uid = functions.encryt(id,iv);
  var count = data.devices.length;
  res.render('index', {title:'Home Page', deviceNum:count,output:data,uid:uid,iv:iv1,version:version});
});



module.exports = router;
