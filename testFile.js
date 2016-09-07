var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');

var file = fs.readFileSync('./file','utf8');
var data = JSON.parse(file);

/*data.devices[0]["codeON"] = '1381683';
data.devices[0]["codeOFF"] = '1381692';
data.devices[0]["nickname"] = '';

data.devices[1]["codeON"] = '1381827';
data.devices[1]["codeOFF"] = '1381836';
data.devices[1]["nickname"] = '';

data.devices[2]["codeON"] = '1382147';
data.devices[2]["codeOFF"] = '1382156';
data.devices[2]["nickname"] = '';
//console.log(data);
var newData = JSON.stringify(data);*/

//console.log(data.devices[0].codeON);
//var network = 'AndyiPhone(2)';
//console.log(network.replace(/(|)/g,'\$&'));
var device = 45,
    status = 'OFF',
    codeOn = 45645163,
    codeOff = 4564564,
    nickname = 'happy';
var newdata = JSON.parse('{"device":"'+device+'","status":"'+status+'","codeON":"'+codeOn+'","codeOFF":"'+codeOff+'","nickname":"'+nickname+'"}');
data.devices.push(newdata);
data.devices.splice(3);
console.log(data.devices[1].codeON);
//data.devices.pop(data);
//var add = JSON.stringify(data);
/*fs.writeFile('./file',newData,(err) =>{
  if(err) throw err;
});
console.log(data.devices);*/
