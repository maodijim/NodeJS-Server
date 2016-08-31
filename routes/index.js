var express = require('express');
var request = require('request');
var router = express.Router();


var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22sfo%22&format=json&diagnostics=true&callback=';
var json = '';
setInterval(function(){
  request({url:url,json:true}, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          json = body
          console.log(body.query.results.place.locality1.content);
          console.log(body.query.created);
          console.log("Status OK")
        //  console.log(body) // Print the json response
        //  console.log(body.city)
        //  console.log(body.stateProv)
      }else{
        console.log("Error")
      }
  })
},3500);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', city: json });
});

module.exports = router;
