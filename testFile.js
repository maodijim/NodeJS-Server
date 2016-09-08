var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');
const exec = require('child_process').exec;



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
/*var device = 45,
status = 'OFF',
codeOn = 45645163,
codeOff = 4564564,
nickname = 'happy';

var newdata = JSON.parse('{"device":"'+device+'","status":"'+status+'","codeON":"'+codeOn+'","codeOFF":"'+codeOff+'","nickname":"'+nickname+'"}');
data.devices.push(newdata);
data.devices.splice(3);
console.log(data.devices);*/


//console.log(newData);

setInterval(function(){
  var url = 'http://wireless.worldelectronicaccessory.com/jsonTest.php';
  var file = fs.readFileSync('./file','utf8');
  var data = JSON.parse(file);
  var newData =[];

  for(var i=0; i < data.devices.length;i++){
    newData.push({device:data.devices[i].device,status:data.devices[i].status,deviceNick:data.devices[i].nickname});
  };

  request.post({url:url,form:{data:newData}},function(err,res,body){

    if (!err && res.statusCode === 200) {
      if(body == "Match"){
        console.log("Do Nothing");
      }else{
        var json = JSON.parse(body);
        for(var i=0;i<data.devices.length;i++){
          if(data.devices[i].status != json[i].status){
            data.devices[i].status = json[i].status;
            var writeData = JSON.stringify(data);
            fs.writeFile('file',writeData,(err) => {
              if (err) console.log(err);
            });
          }

          if(data.devices[i].nickname != json[i].deviceNick){
            data.devices[i].nickname = json[i].deviceNick;
            var writeData = JSON.stringify(data);
            fs.writeFile('file',writeData,(err) => {
              if (err) console.log(err);;
            });
          }
          /*  command = 'sudo /home/pi/433Utils/RPi_utils/codesend '+ code +' 0 120';
          exec(command,function(error,stdout,stderr){
          fs.writeFile('file',writeData,(err) => {
          if (err) console.log(err);
        });
      });*/
    }
  }
}
});
},5000);
//  console.log(body) // Print the json response
//  console.log(body.city)
//  console.log(body.stateProv)
//data.devices.pop(data);
//var add = JSON.stringify(data);
/*fs.writeFile('./file',newData,(err) =>{
if(err) throw err;
});
console.log(data.devices);*/
