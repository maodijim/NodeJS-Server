var express = require('express');
var router = express.Router();
const exec = require('child_process');
var fs = require('fs');


var file = fs.readFileSync('./file0','utf8');
var file1 = fs.readFileSync('./file1','utf8');
var file2 = fs.readFileSync('./file2','utf8');
var file3 = fs.readFileSync('./file3','utf8');
console.log(file2);
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
  res.render('test', { title: 'Test',status0:file,status1:file1,status2:file2,status3:file3});
});

module.exports = router;
