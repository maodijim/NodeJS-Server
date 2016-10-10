/* Author: Wireless Switch
*/

var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('util');
var request = require('request');
var bodyParser = require('body-parser');
const execSync = require('child_process').execSync;
var crypto = require("crypto");
var mysql = require('mysql');
var functions = require('./functions');
var timeFrame = 1800;


var myfunction = function(){
  /*clearInterval(sendRequest);
  var lastModified = fs.statSync('file');
  var mtime = Date.parse(util.inspect(lastModified.mtime));
  var date = Date.parse(new Date());
  if (date > mtime+1000*60)
  timeFrame= 1000;
  else
  timeFrame = 1000;*/
  var connection = mysql.createConnection(functions.connect);



  var url = 'http://wireless.worldelectronicaccessory.com/jsonTest.php';
  var file = fs.readFileSync('/home/pi/Public/NodeJS-Server/file','utf8');
  //var file = execSync('python functions.py').toString();
  var data = JSON.parse(file);
  var newData =[];
  var id = data.id;
  var iv = crypto.randomBytes(16);
  var iv1 = iv.toString('hex');
  var uid = functions.encryt(id,iv);

  if(data.devices.length == 0){
    request.post({url:url,form:{data:'empty',uid:uid,iv:iv1}},function(err,res,body){
      //Server Changed
      if (!err && res.statusCode === 200 && body != 'empty') {
        file = execSync('python functions.py').toString();
        dbdata = JSON.parse(file);
        var json = JSON.parse(body);
        dbdata.devices = json;
        console.log(dbdata);
        for(var i=0;i<dbdata.devices.length;i++){
          data.devices[i] = '{"status":"'+dbdata.devices[i].status+'","nickname":"'+dbdata.devices[i].nickname+'"}';
          connection.query("INSERT INTO `devices` (`device`,`status`,`codeON`,`codeOFF`,`nickname`) values (?,?,?,?,?)",[dbdata.devices[i].device,dbdata.devices[i].status,dbdata.devices[i].codeON,dbdata.devices[i].codeOFF,dbdata.devices[i].nickname],function(err,rows,fields){
            if(err) throw err;
          });
        }
        var writeData = JSON.stringify(data);
        fs.writeFileSync('file',writeData);
      }
    });
  }

  if(data.devices.length > 0){
    for(var i=0; i < data.devices.length;i++){
      newData.push({status:data.devices[i].status,nickname:data.devices[i].nickname});
    }
    newData = JSON.stringify(newData);
    request.post({url:url,form:{data:newData,uid:uid,iv:iv1}},function(err,res,body){
      if (!err && res.statusCode === 200) {
        if(body == 'match'){
        }else{
          dbfile = execSync('python functions.py').toString();
          dbdata = JSON.parse(dbfile);
          var json = JSON.parse(body);
          if(dbdata.devices.length == json.length){
            for(var i=0;i<dbdata.devices.length;i++){
              //Change Status and Exec
              if(dbdata.devices[i].status != json[i].status){
                dbdata.devices[i].status = json[i].status;
                data.devices[i].status = json[i].status;
                var writeData = JSON.stringify(data);
                if (dbdata.devices[i].status == "ON"){
                  connection.query("UPDATE `devices` SET `status`=? where codeON=?",['ON',dbdata.devices[i].codeON],function(err,rows,fields){
                    if(err) throw err;
                  });
                  var command = 'sudo ./codesend '+ dbdata.devices[i].codeON +' 1 120';
                  execSync(command)
                  fs.writeFileSync('file',writeData);
                }else{
                  connection.query("UPDATE `devices` SET `status`=? where codeON=?",['OFF',dbdata.devices[i].codeON],function(err,rows,fields){
                    if(err) throw err;
                  });
                  var command = 'sudo ./codesend '+ dbdata.devices[i].codeOFF +' 1 120';
                  execSync(command)
                  fs.writeFileSync('file',writeData);
                }
              }

              //Change Nick Name
              if(dbdata.devices[i].nickname != json[i].nickname){
                dbdata.devices[i].nickname = json[i].nickname;
                data.devices[i].nickname = json[i].nickname;
                var writeData = JSON.stringify(data);
                connection.query("UPDATE `devices` SET `nickname`=? where codeON=?",[dbdata.devices[i].nickname,dbdata.devices[i].codeON],function(err,rows,fields){
                  if(err) throw err;
                });
                fs.writeFile('file',writeData,(err) => {
                  if (err) console.log(err);;
                });
              }

            }
          }else{
              //Server Changed
              dbdata.devices = json;
              connection.query("truncate table devices",function(err,rows,fields){
                if(err) throw err;
              });
              if(dbdata.devices.length == 0){
                var writeData = JSON.stringify(dbdata);
              }else{
                for(var i=0;i<dbdata.devices.length;i++){
                  data.devices[i] = '{"status":"'+dbdata.devices[i].status+'","nickname":"'+dbdata.devices[i].nickname+'"}';
                  var writeData = JSON.stringify(data);
                  connection.query("INSERT INTO `devices` (`device`,`status`,`codeON`,`codeOFF`,`nickname`) values (?,?,?,?,?)",[dbdata.devices[i].device,dbdata.devices[i].status,dbdata.devices[i].codeON,dbdata.devices[i].codeOFF,dbdata.devices[i].nickname],function(err,rows,fields){
                    if(err) throw err;
                  });
                }
              }

              fs.writeFileSync('file',writeData);
            }
          }
        }
    });
}
//connection.end();
}
var sendRequest = setInterval(myfunction,timeFrame);
