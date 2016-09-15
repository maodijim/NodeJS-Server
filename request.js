var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('util');
var request = require('request');
var bodyParser = require('body-parser');
const exec = require('child_process').exec;
var crypto = require("crypto");
var functions = require('./functions');
var timeFrame = 1000;

// Recursive Function to get request from server
var myfunction = function(){
/*  clearInterval(sendRequest);
  var lastModified = fs.statSync('file');
  var mtime = Date.parse(util.inspect(lastModified.mtime));
  var date = Date.parse(new Date());
  if (date > mtime+1000*60)
    timeFrame= 1000;
  else
    timeFrame = 1000;
*/
  var url = 'http://wireless.worldelectronicaccessory.com/jsonTest.php';
  var file = fs.readFileSync('./file','utf8');
  var data = JSON.parse(file);
  var newData =[];
  var id = data.id;
  var iv = crypto.randomBytes(16);
  var iv1 = iv.toString('hex');
  var uid = functions.encryt(id,iv);



  if(data.devices.length > 0){
    for(var i=0; i < data.devices.length;i++){
      newData.push({device:data.devices[i].device,status:data.devices[i].status,deviceNick:data.devices[i].nickname});
    };

    request.post({url:url,form:{data:newData,uid:uid,iv:iv1}},function(err,res,body){

      if (!err && res.statusCode === 200) {
        if(body == "Match"){
          //console.log("Do Nothing");
        }else{
          var json = JSON.parse(body);
          if(data.devices.length == json.length){
            for(var i=0;i<data.devices.length;i++){
              //Change Status and Exec
              if(data.devices[i].status != json[i].status){
                data.devices[i].status = json[i].status;
                var writeData = JSON.stringify(data);
                if (data.devices[i].status == "ON"){
                  var command = 'sudo /home/pi/433Utils/RPi_utils/codesend '+ data.devices[i].codeON +' 0 120';
                }else{
                  command = 'sudo /home/pi/433Utils/RPi_utils/codesend '+ data.devices[i].codeOFF +' 0 120';
                }
                exec(command,function(error,stdout,stderr){
                  fs.writeFile('file',writeData,(err) => {
                    if (err) console.log(err);
                  });
                });
              }
              //Change Nick Name
              if(data.devices[i].nickname != json[i].deviceNick){
                data.devices[i].nickname = json[i].deviceNick;
                var writeData = JSON.stringify(data);
                fs.writeFile('file',writeData,(err) => {
                  if (err) console.log(err);;
                });
              }

            }
          }
        }
      }
    });
  }
  //sendRequest = setInterval(myfunction,timeFrame);
};

var sendRequest = setInterval(myfunction,timeFrame);
