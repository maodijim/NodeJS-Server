var spawn = require('child_process').spawn;
var functions = require('./functions');
var mysql = require('mysql');
var statusChange = require('./request');
var crypto = require("crypto");

var connection = mysql.createConnection(functions.connect);

connection.query("SELECT * FROM id;",function(err,rows,fields){
  if(err) throw err;
  var id = crypto.createHash('sha1').update(rows[0].id).digest('hex');
  const mqtt = spawn('mosquitto_sub',['-h','52.91.67.124','-t',id,'-v']);
  mqtt.stdout.on('data',(data)=>{
    statusChange.update();
  });
});

/*var mqtt = require('mqtt');
var client  = mqtt.connect('tcp://test.mosquitto.org:1883');

client.on('connect', function () {
  client.subscribe('mqtt/')
  client.publish('mqtt', 'Hello mqtt')
  console.log('connect');
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic+' '+message)
  //client.end()
})*/
