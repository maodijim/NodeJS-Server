/* Author: Wireless Switch
Version:1.2.6
*/
var express = require('express');
const exec = require('child_process').exec,
      spawn = require('child_process').spawn,
      execSync = require('child_process').execSync;
var path = require('path');
var request = require('request');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var bodyParser = require('body-parser');
var wifiPage = require('./routes/wifi');
var searchPage = require('./routes/search');
var routes = require('./routes/index');
var async = require('async');
var mysql = require('mysql');
var functions = require('./functions');
var crypto = require("crypto");
//var users = require('./routes/users');
//var about = require('./routes/about');
//var test = require('./routes/test');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var connection = mysql.createConnection(functions.connect);
var deviceStatus = null,
deviceNum = null,
file = null,
readData = null,
count = null,
code = null,
command = null,
wpa_config = '/etc/wpa_supplicant/wpa_supplicant.conf';
var url = 'https://www.wswitch.net/jsonTest.php';
/* Custom Functions Go here
---------------------------*/

//POST data from switch status
app.post('/reconnect',function(req,resp){
  command = 'python wifiCheck.py start';
  execSync(command);
});

app.post('/',function(req,response){
  deviceStatus = req.body.status;
  deviceNum = req.body.device;
  console.log(deviceStatus);
  file = execSync('python functions.py').toString();
  readData = JSON.parse(file);
  var id = readData.id;
  var iv = crypto.randomBytes(16);
  var iv1 = iv.toString('hex');
  var uid = functions.encryt(id,iv);
  if(readData.length != 0 ){
    if(deviceStatus == 'ON'){
      readData.devices[deviceNum].status = 'ON';
      var writeData = JSON.stringify(readData);
      connection.query("UPDATE `devices` SET `status`=? where codeON=?",['ON',readData.devices[deviceNum].codeON],function(err,rows,fields){
        if(err) throw err;
      });
      //  count = readData.devices.length;
      code = readData.devices[deviceNum].codeON;
      command = 'python3 codesend -p 120 ' + code;
      exec(command,function(error,stdout,stderr){
        //  fs.writeFile('file',writeData,(err) => {
        //    if (err) throw err;
        //  });
      });

    }else if(deviceStatus == 'OFF'){
      readData.devices[deviceNum].status = 'OFF';
      var writeData = JSON.stringify(readData);
      connection.query("UPDATE `devices` SET `status`=? where codeON=?",['OFF',readData.devices[deviceNum].codeON],function(err,rows,fields){
        if(err) throw err;
      });
      //count = readData.devices.length;
      code = readData.devices[deviceNum].codeOFF;
      command = 'python3 codesend -p 120 '+ code;
      exec(command,function(error,stdout,stderr){
        //  fs.writeFile('file',writeData,(err) => {
        //    if (err) throw err;
        //  });
      });
    }
  }request.post('https://www.worldelectronicaccessory.com/WebSale/localChange.php',{form:{deviceNum:deviceNum,status:deviceStatus,uid:uid,iv:iv1}});
  response.send('file');
});

//POST data from wifi page
app.post('/wifi',function(req,res){
  var id = req.body.id;
  var pas = req.body.pas;

  command = 'sudo wpa_passphrase "'+id+'" "'+pas+'" >> '+wpa_config;
  var startWifi = 'python wifiCheck.py start';
  //console.log(command);
  exec(command,function(err,stdout,stderr){
    if(err){
      //console.log(err);
      res.send('Save Wifi Info Failed');
    }else{
      //  console.log(stdout);
      res.send('Save Wifi Info Sucess');
    }
  });
  //Start wifi Connection
  exec(startWifi,function(err,stdout,stderr){
    if(err){
      //console.log(err);
      res.send('Start Wifi Failed');
    }
  });
});

//POST data from namechange
app.post('/name',function(req,res){
  file = execSync('python functions.py').toString();
  readData = JSON.parse(file);
  var deviceNum = req.body.device;
  var newName = req.body.newName;
  console.log(deviceNum);
    file = execSync('python functions.py').toString();
    readData = JSON.parse(file);
    if(readData.length != 0 ){
      readData.devices[deviceNum].nickname = newName;
      //request.post(url).form({deviceNum:deviceNum,newName:newName});
      connection.query("UPDATE `devices` SET `nickname`=? where codeON=?",[newName,readData.devices[deviceNum].codeON],function(err,rows,fields){
        if(err) throw err;
      });
    //  writeData = JSON.stringify(readData);
    //  fs.writeFile('file',writeData,(err)=>{if(err)throw err;});
      res.send('success');
    }
  });

//POST dat for Add New Device
app.post('/add',function(req,res){
  var deviceNum = 'device'+req.body.device;
  var nickName = req.body.nickName;
  var onCode = req.body.oncode;
  var offCode = req.body.offcode;
  file = execSync('python functions.py').toString();
  readData = JSON.parse(file);
  if(nickName.length == 0) nickName = deviceNum;
  var newdata = JSON.parse('{"device":"'+deviceNum+'","status":"OFF","codeON":"'+onCode+'","codeOFF":"'+offCode+'","nickname":"'+nickName+'"}');
  readData.devices.push(newdata);
  connection.query("INSERT INTO `devices` (`device`,`status`,`codeON`,`codeOFF`,`nickname`) values (?,?,?,?,?)",[deviceNum,'OFF',onCode,offCode,nickName],function(err,rows,fields){
    if(err) throw err;
  });
//  var add = JSON.stringify(readData);
//  fs.writeFile('file',add,(err) => {
//    if (err) throw err;
//  });

  res.send('success');
});

//Return search result
app.post('/searchcode',function(req,res){
  command = 'python3 RFSniffer1';
  var child = spawn('python', ['RFSniffer1']);

  child.stdout.on('data',(data)=>{
    res.send(data.toString('utf8').substring(9));
    //console.log(data.toString('utf8').substring(9));
  })

  setTimeout(function(){
    child.kill();
  },10000);
});

//Delete Element
app.post('/delete',function(req,res){
  deviceNum = req.body.device;
  file = execSync('python functions.py').toString();
  readData = JSON.parse(file);
  if(readData.length !=0 ){
    readData.devices.splice(deviceNum,1);
    connection.query("truncate table devices",function(err,rows,fields){
      if(err) throw err;
    });
    for(var i=0;i<readData.devices.length;i++){
      connection.query("INSERT INTO `devices` (`device`,`status`,`codeON`,`codeOFF`,`nickname`) values (?,?,?,?,?)",[readData.devices[i].device,readData.devices[i].status,readData.devices[i].codeON,readData.devices[i].codeOFF,readData.devices[i].nickname],function(err,rows,fields){
        if(err) throw err;
      });
    }
  //  var add = JSON.stringify(readData);
  //  fs.writeFile('file',add,(err)=>{
  //    if(err) console.log(err);
      res.send('success');
    //})
  }
});
/* ---------------------------
Custom Functions End here */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/wifi',wifiPage);
app.use('/search',searchPage)
//app.use('/users', users);
//app.use('/about', about);
//app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
