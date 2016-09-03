var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');

var file = fs.readFileSync('./file','utf8');
var data = JSON.parse(file);
//data.devices[0].status = "OFF";
var device = 'device3';
var status = 'OFF';
var newdata = JSON.parse('{"device":"'+device+'","status":"'+status+'"}');
data.devices.push(newdata);
data.devices.pop(data);
//var add = JSON.stringify(data);
/*fs.writeFile('./file',add,(err) =>{
  if(err) throw err;
});*/
console.log(data.devices);
