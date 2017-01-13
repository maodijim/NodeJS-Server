var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const exec = require('child_process').exec;
var mysql = requre('mysql');

/* GET WIFI page. */
router.get('/', function(req, res, next) {
  var wifi =  exec('sudo iwlist wlan0 scan | egrep "ESSID"',function(err,stdout,stderr){
    if(err) console.log(err);
    var file = execSync('python functions.py').toString();
    var data = JSON.parse(file);
    var id = data.id;
    var view = stdout.toString().split('\n');
    res.render('wifi', { title: 'Wifi Connection',
    arr:view,
    wificount:view.length,
    id:id
  });
});
});








module.exports = router;
