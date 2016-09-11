var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');
var functions = require('./functions');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
var crypto = require("crypto");
var functions = require('./functions');
/*var name = 'this is my secret',
key = crypto.createHash('md5').update(name).digest('hex'),
iv  = 'df451ewrtf125rtt',
cipher = crypto.createCipheriv('aes-256-cbc',key,iv),
decipher = crypto.createDecipheriv('aes-256-cbc',key,iv);

var text = 'Happy Holiday',
crypted = cipher.update(text,'utf-8','hex');
crypted += cipher.final('hex');
request.post({url:'http://wireless.worldelectronicaccessory.com/test',form:{valid:crypted}},function(err,res,body){
  console.log(body);
});
*/
//Check file exists
var file = fs.readFileSync('file','utf8');
var data = JSON.parse(file);
var id = data.id;
console.log(id);
var iv = crypto.randomBytes(16);
var output = functions.encryt(id,iv);
console.log(output);

/*fs.stat('file',function(err,stat){
  if(err == null){
    console.log("Yes File Exist");
  }else if(err.code == 'ENOENT')
   console.log('No File Not Exist');
  else console.log("Some Other Error");
});

var file = fs.readFileSync('file','utf8');
var data = JSON.parse(file);
data.devices.splice(0);
data['id'] = '';
console.log(data);
//{ devices: [], id: '' }
var iv = crypto.randomBytes(16);
var input = 'this is kjlkjl';
var output = functions.encryt('happy',iv);
console.log(output);
*/
/* Encryt Demo
var status = 'true';
var verify = crypto.createHash('md5').update(status).digest('hex');
//console.log(verify);

function getID(callback){
  var child = spawn('python', ['getID.py']);
  child.stdout.on('data',(data)=>{
    var id = data.toString('utf8'),
    crypto = require("crypto"),
    name = 'this is my secret',
    key = crypto.createHash('md5').update(name).digest('hex'),
    iv  = 'df451ewrtf125rtt',
    cipher = crypto.createCipheriv('aes-256-cbc',key,iv),
    decipher = crypto.createDecipheriv('aes-256-cbc',key,iv);

    var crypted = cipher.update(id,'utf-8','hex');
    crypted += cipher.final('hex');
    return callback(crypted);
  });
}
var reuslt= getID(function(data){
    console.log(data);
});
*/

/*child.stderr.on('data', (data) => {
console.log(`stderr: ${data}`);
});

child.on('close', (code) => {
console.log(`child process exited with code ${code}`);
});*/

//  var    decrypted = decipher.update(crypted,'hex','binary');
//        decrypted += decipher.final('binary');

//    console.log("Text:"+crypted);
//    console.log(crypted.length);
//    console.log(decrypted);





/*data.devices[0]["codeON"] = '1381683';
data.devices[0]["codeOFF"] = '1381692';
data.devices[0]["nickname"] = '';

data.devices[1]["codeON"] = '1381827';
data.devices[1]["codeOFF"] = '1381836';
data.devices[1]["nickname"] = '';

data.devices[2]["codeON"] = '1382147';
data.devices[2]["codeOFF"] = '1382156';
data.devices[2]["nickname"] = '';
//console.log(data);
var newData = JSON.stringify(data);*/

//console.log(data.devices[0].codeON);
//var network = 'AndyiPhone(2)';
//console.log(network.replace(/(|)/g,'\$&'));
/*var device = 45,
status = 'OFF',
codeOn = 45645163,
codeOff = 4564564,
nickname = 'happy';

var newdata = JSON.parse('{"device":"'+device+'","status":"'+status+'","codeON":"'+codeOn+'","codeOFF":"'+codeOff+'","nickname":"'+nickname+'"}');
data.devices.push(newdata);
data.devices.splice(3);
console.log(data.devices);*/


//console.log(newData);

/*setInterval(function(){
var url = 'http://wireless.worldelectronicaccessory.com/jsonTest.php';
var file = fs.readFileSync('./file','utf8');
var data = JSON.parse(file);
var newData =[];

for(var i=0; i < data.devices.length;i++){
newData.push({device:data.devices[i].device,status:data.devices[i].status,deviceNick:data.devices[i].nickname});
};

request.post({url:url,form:{data:newData}},function(err,res,body){

if (!err && res.statusCode === 200) {
if(body == "Match"){
console.log("Do Nothing");
}else{
var json = JSON.parse(body);
for(var i=0;i<data.devices.length;i++){
if(data.devices[i].status != json[i].status){
data.devices[i].status = json[i].status;
var writeData = JSON.stringify(data);
fs.writeFile('file',writeData,(err) => {
if (err) console.log(err);
});
}

if(data.devices[i].nickname != json[i].deviceNick){
data.devices[i].nickname = json[i].deviceNick;
var writeData = JSON.stringify(data);
fs.writeFile('file',writeData,(err) => {
if (err) console.log(err);;
});
}
/*  command = 'sudo /home/pi/433Utils/RPi_utils/codesend '+ code +' 0 120';
exec(command,function(error,stdout,stderr){
fs.writeFile('file',writeData,(err) => {
if (err) console.log(err);
});
});*/
//}
//}
//}
//});
//},5000);
//  console.log(body) // Print the json response
//  console.log(body.city)
//  console.log(body.stateProv)
//data.devices.pop(data);
//var add = JSON.stringify(data);
/*fs.writeFile('./file',newData,(err) =>{
if(err) throw err;
});
console.log(data.devices);*/
