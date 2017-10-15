/* Author: Wireless Switch
Version:1.2.3
*/

var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('util');
var request = require('request');
var bodyParser = require('body-parser');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
var crypto = require("crypto");
var mysql = require('mysql');
var functions = require('./functions');

module.exports = {
  //var timeFrame = 1800;
  update: function(){
    var connection = mysql.createConnection(functions.connect);
    var url = 'https://www.wswitch.net/jsonTest.php';
    //var file = fs.readFileSync('/home/pi/Public/NodeJS-Server/file','utf8');
    var file = execSync('python /home/pi/Public/NodeJS-Server/functions.py').toString();
    var data = JSON.parse(file);
    var newData =[];
    var id = data.id;
    var iv = crypto.randomBytes(16);
    var iv1 = iv.toString('hex');
    var uid = functions.encryt(id,iv);

    if(data.devices.length == 0){
      connection.query("truncate table devices",function(err,rows,fields){
        if(err) throw err;
      });
      request.post({url:url,form:{data:'empty',uid:uid,iv:iv1}},function(err,res,body){
        //Server Changed
        if (!err && res.statusCode === 200 && body != 'empty') {
          var json = JSON.parse(body);
          data.devices = json;
          for(var i=0;i<data.devices.length;i++){
            connection.query("INSERT INTO `devices` (`device`,`status`,`codeON`,`codeOFF`,`nickname`) values (?,?,?,?,?)",[data.devices[i].device,data.devices[i].status,data.devices[i].codeON,data.devices[i].codeOFF,data.devices[i].nickname],function(err,rows,fields){
              if(err) throw err;
            });
          }
          var writeData = JSON.stringify(data);
          //fs.writeFileSync('file',writeData);
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
          }else if (body == 'update') {
            //Update New Version Software
            execSync('git checkout .');
            execSync('git pull');
            execSync('sudo chmod +x codesend RFSniffer1');
            execSync('sudo pm2 delete mqtt');
            execSync('sudo pm2 delete www');
            execSync('sudo pm2 start /home/pi/Public/NodeJS-Server/mqtt.js');
            execSync('sudo pm2 start /home/pi/Public/NodeJS-Server/bin/www');
          }else if (body.substr(0,5) == 'order') {
            //Device Order Change Handler
            var arr = body.split(/[:,]/);
            for(var i=0; i<data.devices.length;i++){
              connection.query("UPDATE `devices` SET `device`=?,`status`=?,`codeON`=?,`codeOFF`=?,`nickname`=? where id=?",[data.devices[i].device,data.devices[i].status,data.devices[i].codeON,data.devices[i].codeOFF,data.devices[i].nickname,arr[i+1]],function(err,rows,fields){
                if(err) throw err;
              });
            }
          }
          else{
            var json = JSON.parse(body);
            if(data.devices.length == json.length){
              for(var i=0;i<data.devices.length;i++){
                //Change Status and Exec
                if(data.devices[i].status != json[i].status){
                  data.devices[i].status = json[i].status;
                  var writeData = JSON.stringify(data);
                  if (data.devices[i].status == "ON"){
                    connection.query("UPDATE `devices` SET `status`=? where codeON=?",['ON',data.devices[i].codeON],function(err,rows,fields){
                      if(err) throw err;
                    });
                    var command = 'sudo ./codesend '+ data.devices[i].codeON +' 1 120';
                    exec(command)
                    //  fs.writeFileSync('file',writeData);
                  }else{
                    connection.query("UPDATE `devices` SET `status`=? where codeON=?",['OFF',data.devices[i].codeON],function(err,rows,fields){
                      if(err) throw err;
                    });
                    var command = 'sudo ./codesend '+ data.devices[i].codeOFF +' 1 120';
                    exec(command)
                    //fs.writeFileSync('file',writeData);
                  }
                }

                //Change Nick Name
                if(data.devices[i].nickname != json[i].nickname){
                  data.devices[i].nickname = json[i].nickname;
                  var writeData = JSON.stringify(data);
                  connection.query("UPDATE `devices` SET `nickname`=? where codeON=?",[data.devices[i].nickname,data.devices[i].codeON],function(err,rows,fields){
                    if(err) throw err;
                  });
                  /*fs.writeFile('file',writeData,(err) => {
                  if (err) console.log(err);;
                });*/
              }

            }
          }else{
            //Server Changed
            connection.query("truncate table devices",function(err,rows,fields){
              if(err) throw err;
            });
            if(data.devices.length == 0){
              var writeData = JSON.stringify(data);
            }else{
              data.devices = json;
              for(var i=0;i<data.devices.length;i++){
                var writeData = JSON.stringify(data);
                connection.query("INSERT INTO `devices` (`device`,`status`,`codeON`,`codeOFF`,`nickname`) values (?,?,?,?,?)",[data.devices[i].device,data.devices[i].status,data.devices[i].codeON,data.devices[i].codeOFF,data.devices[i].nickname],function(err,rows,fields){
                  if(err) throw err;
                });
              }
            }
            //fs.writeFileSync('file',writeData);
          }
        }
      }
    });
  }
  //connection.end();
 }
}
