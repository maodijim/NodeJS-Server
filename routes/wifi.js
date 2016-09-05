var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const exec = require('child_process').exec;


/* GET about page. */
router.get('/', function(req, res, next) {
  var wifi =  exec('sudo iwlist wlan0 scan | egrep "ESSID"',function(err,stdout,stderr){
    if(err) console.log(err);
    var view = stdout.toString().split('\n');
    res.render('wifi', { title: 'Wifi Connection',
    arr:view,
    wificount:view.length,
  });
});
});








module.exports = router;
