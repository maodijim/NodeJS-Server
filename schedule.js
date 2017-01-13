var request = require('request');

request.post("http://localhost/",
              {form:{device:process.argv[2],status:process.argv[3]}},
            function(err,res,body){
              if(!err && res.statusCode == 200){
                console.log(body);
              }
            });
