var movies = require('././movies');

var buckyMovie = movies();
buckyMovie.favMovie = "Good Will Hunting";
console.log("Bucky's favorite movie is: " + buckyMovie.favMovie);

setInterval(function(){
  console.log("hello")},1000
);
