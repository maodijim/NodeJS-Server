var fs = require('fs'),
request = require('request'),
bodyParser = require('body-parser'),
crypto = require("crypto");
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
var crypto = require("crypto");
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'switch',
  password : 'newswitch',
  database : 'switches'
});

module.exports = {

  // Encrypt data
  encryt: function (string,iv){
    var name = 'this is my secret';
    //var iv = '0223547894561235';
    var key = crypto.createHash('md5').update(name).digest('hex');
    var cipher = crypto.createCipheriv('aes-256-cbc',key,iv);
    //decipher = crypto.createDecipheriv('aes-256-cbc',key,iv);
    var crypted = cipher.update(string,'utf-8','hex');
        crypted += cipher.final('hex');
        return crypted;
  },
  connect:{
    host     : 'localhost',
    user     : 'switch',
    password : 'newswitch',
    database : 'switches'
  }
};
