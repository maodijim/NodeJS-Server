var request = require('request');
var mysql = require('mysql');
var functions = require('./functions');
const execSync = require('child_process').execSync;

var connection = mysql.createConnection(functions.connect);
var url = 'http://wireless.worldelectronicaccessory.com/test.php';
request.post(url,function(err,res,body){
  var arr = body.split(/[,:]/);
  console.log(arr);
  connection.query("SELECT * from devices",function(err,result){
    console.log(result);
/*
    for(var i=1; i<arr.length;i++){
      console.log(arr[i]);
    connection.query("UPDATE `devices` SET `device`=?,`status`=?,`codeON`=?,`codeOFF`=?,`nickname`=? where id=?",[result[arr[i]-1].device,result[arr[i]-1].status,result[arr[i]-1].codeON,result[arr[i]-1].codeOFF,result[arr[i]-1].nickname,i],function(err,rows,fields){
        if(err) throw err;
    });
  }
  */
  });
});
