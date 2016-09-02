var express = require('express');
var router = express.Router();
const exec = require('child_process');
var fs = require('fs');


var file = fs.readFileSync('./file','utf8');
var data = JSON.parse(file);
var output = JSON.stringify(data);
console.log(output);
//console.log(file);

/*setInterval(function run(){
exec.exec('cd ',function(error,stdout,stderr){
  console.log('stdout: ' + stdout);®
  console.log('stderr: ' + stderr);
  if(error !== null){
    console.log('exec error: ' + error);
  }
});®
},5000);*/

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('test', { title: 'Test',this:output});
});

module.exports = router;
