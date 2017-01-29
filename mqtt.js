var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var functions = require('./functions');
var mysql = require('mysql');
var statusChange = require('./request');
var crypto = require("crypto");
var cron = require('crontab');

var connection = mysql.createConnection(functions.connect);

connection.query("SELECT * FROM id;",function(err,rows,fields){
  if(err) throw err;
  var id = crypto.createHash('sha1').update(rows[0].id).digest('hex');
  const mqtt = spawn('mosquitto_sub',['-h','52.201.197.194','-t',id,'-v']);
  mqtt.stdout.on('data',(data)=>{
    var result = data.toString().split(" ");
    if(result[1].includes("change")){
      statusChange.update();
    }else if (result[1].includes("time:")) {
      var schedule = result[1].substring(5).split(/-|\n/);

        var status = schedule[1];
        var deviceNum = schedule[0];
        if (schedule[3] == "every"){
            var time = schedule[2].split(":");
            var date = '';
            for(var i = 4; i<schedule.length-1; i++){
              date += schedule[i];
              if(i != schedule.length-2){
                date += ",";
              }
            }

            cron.load(function(err,crontab) {
              var job = crontab.create('node /home/pi/Public/NodeJS-Server/schedule.js ' + deviceNum + " " + status , '* ' + time[1] + " " +time[0] + ' * ' + date);
              crontab.save(function(err, crontab) {
              });
            });

        }else if(schedule[3] == "remove"){
          var var time = schedule[2].split(":");
          var date = '';
          for(var i =4; i<schedule.length-1; i++){
            date += schedule[i];
            if(i != schedule.length-2){
              date += ",";
            }
          }

          cron.load(function(err,crontab){
            var job = crontab.create('node /home/pi/Public/NodeJS-Server/schedule.js ' + deviceNum + " " + status , '* ' + time[1] + " " +time[0] + ' * ' + date);
            crontab.remove(job);
          });
        }
        else{
          var command = "echo node /home/pi/Public/NodeJS-Server/schedule.js "+deviceNum+" "+status+" | at "+schedule[2]+" "+schedule[3];
          exec(command,function(error,stdout,stderr){});
        }


    }

  });
});
