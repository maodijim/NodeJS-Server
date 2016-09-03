var express = require('express');
const exec = require('child_process').exec;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//var users = require('./routes/users');
var about = require('./routes/about');
var test = require('./routes/test');

var app = express();

app.post('/',function(request,response){
  var status = request.body.status;
  var deviceNum = request.body.device;
  var file = fs.readFileSync('file','utf8');
  var readData = JSON.parse(file);
//  var file = 'file'+request.body.device;
  if(status == 'ON'){
    readData.devices[deviceNum].status = "ON";
    var writeData = JSON.stringify(readData);
    fs.writeFile('file',writeData,(err) => {
      if (err) throw err;
      console.log('On');
      /*exec('cd ',function(error,stdout,stderr){
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if(error !== null){
          console.log('exec error: ' + error);
        }
      });*/
    });
  }else if(status == 'OFF'){
    readData.devices[deviceNum].status = "OFF";
    var writeData = JSON.stringify(readData);
    fs.writeFile('file',writeData,(err) => {
      if (err) throw err;
      console.log('OFF');
    });
  }
  response.send('file changed');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);
app.use('/about', about);
app.use('/test', test);

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
