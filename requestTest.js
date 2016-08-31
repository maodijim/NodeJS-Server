var request = require('request');

var url = 'http://wechat.worldelectronicaccessory.com/jsonTest.php';
setInterval(function(){request.post({url:url,form:{name:'nihao'}},function(err,resp,body){
  if (!err && resp.statusCode === 200) {
      //json = JSON.parse(body)
      console.log(body);
      console.log("Status OK")
    //  console.log(body) // Print the json response
    //  console.log(body.city)
    //  console.log(body.stateProv)
  }else{
    console.log("Error")
  }
})
},5000);
