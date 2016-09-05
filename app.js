var express = require('express');
const exec = require('child_process').exec;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var bodyParser = require('body-parser');
var wifiPage = require('./routes/wifi');
var routes = require('./routes/index');
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
command = null;
/* Custom Functions Go here
---------------------------*/
//POST data from switch status
app.post('/',function(request,response){
  deviceStatus = request.body.status;
  deviceNum = request.body.device;
  file = fs.readFileSync('file','utf8');
  readData = JSON.parse(file);
  //  var file = 'file'+request.body.device;
  if(deviceStatus == 'ON'){
    readData.devices[deviceNum].status = 'ON';
    var writeData = JSON.stringify(readData);
    //  count = readData.devices.length;
    code = readData.devices[deviceNum].codeON;
    command = 'sudo /home/pi/433Utils/RPi_utils/codesend '+code+' 0 188';

    exec(command,function(error,stdout,stderr){
      if(writeData !== ""){
        fs.writeFile('file',writeData,(err) => {
          if (err) throw err;

        });
      }
    });
  }else if(deviceStatus == 'OFF'){
    readData.devices[deviceNum].status = 'OFF';
    var writeData = JSON.stringify(readData);
    //count = readData.devices.length;
    code = readData.devices[deviceNum].codeOFF;
    command = 'sudo /home/pi/433Utils/RPi_utils/codesend '+ code +' 0 188';
    exec(command,function(error,stdout,stderr){
      if(writeData !== ""){
        fs.writeFile('file',writeData,(err) => {
          if (err) throw err;
        });
      }
    });
  }
  response.send('file changed');
});

//POST data from wifi page
app.post('/wifi',function(req,res){
  var id = req.body.id;
  var pas = req.body.pas;

  command = 'sudo wpa_passphrase '+id+' '+pas+' >> /etc/wpa_supplicant/wpa_supplicant.conf';
  console.log(command);
  exec(command,function(err,stdout,stderr){
    if(err){
      console.log(err);
      res.send('Save Wifi Info Failed');
    }else{
      console.log(stdout);
      res.send('Save Wifi Info Sucess');
    }

  });

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
