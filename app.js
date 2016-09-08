var express = require('express');
const exec = require('child_process').exec,
      spawn = require('child_process').spawn;
var path = require('path');
var request = require('request');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var bodyParser = require('body-parser');
var wifiPage = require('./routes/wifi');
var routes = require('./routes/index');
var async = require('async');
//var users = require('./routes/users');
//var about = require('./routes/about');
//var test = require('./routes/test');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var deviceStatus = null,
deviceNum = null,
file = null,
readData = null,
count = null,
code = null,
command = null,
wpa_config = '/etc/wpa_supplicant/wpa_supplicant.conf';
var url = 'http://wireless.worldelectronicaccessory.com/jsonTest.php';
/* Custom Functions Go here
---------------------------*/
//POST data from switch status
app.post('/',function(req,response){
  deviceStatus = req.body.status;
  deviceNum = req.body.device;
  file = fs.readFileSync('file','utf8');
  readData = JSON.parse(file);
  //  var file = 'file'+req.body.device;
  if(readData.length != 0 ){
    if(deviceStatus == 'ON'){
      readData.devices[deviceNum].status = 'ON';
      var writeData = JSON.stringify(readData);
      //  count = readData.devices.length;
      code = readData.devices[deviceNum].codeON;
      command = 'sudo /home/pi/433Utils/RPi_utils/codesend '+code+' 0 188';
      exec(command,function(error,stdout,stderr){
          fs.writeFile('file',writeData,(err) => {
            if (err) throw err;
          });
      });
    }else if(deviceStatus == 'OFF'){
      readData.devices[deviceNum].status = 'OFF';
      var writeData = JSON.stringify(readData);
      //count = readData.devices.length;
      code = readData.devices[deviceNum].codeOFF;
      command = 'sudo /home/pi/433Utils/RPi_utils/codesend '+ code +' 0 120';
      exec(command,function(error,stdout,stderr){
          fs.writeFile('file',writeData,(err) => {
            if (err) throw err;
          });
      });
    }
  }
  response.send('file');
});

//POST data from wifi page
app.post('/wifi',function(req,res){
  var id = req.body.id;
  var pas = req.body.pas;

  command = 'sudo wpa_passphrase "'+id+'" "'+pas+'" >> '+wpa_config;
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

});

//POST data from namechange
app.post('/name',function(req,res){
  var deviceNum = req.body.device;
  var newName = req.body.newName;
  console.log(deviceNum);
  async.series({
    file = fs.readFileSync('file','utf8');
    readData = JSON.parse(file);
    if(readData.length != 0 ){
      readData.devices[deviceNum].nickname = newName;
      request.post(url).form({deviceNum:deviceNum,newName:newName});
      writeData = JSON.stringify(readData);
      fs.writeFile('file',writeData,(err)=>{if(err)throw err;});
      res.send('success');
    }
  });

});

//POST dat for Add New Device
app.post('/add',function(req,res){
  var deviceNum = 'device'+req.body.device;
  var nickName = req.body.nickName;
  var onCode = req.body.oncode;
  var offCode = req.body.offcode;
  file = fs.readFileSync('file','utf8');

  readData = JSON.parse(file);
  if(nickName.length < 1) nickName = deviceNum;
  var newdata = JSON.parse('{"device":"'+deviceNum+'","status":"OFF","codeON":"'+onCode+'","codeOFF":"'+offCode+'","nickname":"'+nickName+'"}');
  readData.devices.push(newdata);
  var add = JSON.stringify(readData);
  fs.writeFile('file',add,(err) => {
    if (err) throw err;
  });

  res.send('success');
});

//Return search result
app.post('/searchcode',function(req,res){
  command = 'sudo /home/pi/433Utils/RPi_utils/RFSniffer1';
  var child = spawn('sudo', ['/home/pi/433Utils/RPi_utils/RFSniffer1']);

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
  file = fs.readFileSync('file','utf8');
  readData = JSON.parse(file);
  if(readData.length !=0 ){
    readData.devices.splice(deviceNum,1);
    var add = JSON.stringify(readData);
    fs.writeFile('file',add,(err)=>{
      if(err) console.log(err);
      res.send('success');
    })
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
