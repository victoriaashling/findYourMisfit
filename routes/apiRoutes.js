// var db = require("../models");

// module.exports = function(app) {
// Get all examples
// app.get("/api/examples", function(req, res) {
//   db.Example.findAll({}).then(function(dbExamples) {
//     res.json(dbExamples);
//   });
// });

// Create a new example
// app.post("/api/examples", function(req, res) {
//   db.Example.create(req.body).then(function(dbExample) {
//     res.json(dbExample);
//   });
// });

// Delete an example by id
//   app.delete("/api/examples/:id", function(req, res) {
//     db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
//       res.json(dbExample);
//     });
//   });
// };
/////////////////////////////////////////////////////////////////////////
//The above code was given to us with the files.  Here I am 
//going to make the algorithm for finding the (mis)matches.
//note: misfits variable, bestmisMatch

var misfitsList = require("../data/misfits.js");

// var bodyParser = require("body-parser");
// var path = require("path");



module.exports = function(app) {

  app.get("/api/misfits", function(req, res){
    res.json(misfitsList);
  });

  app.post("/api/misfits", function(req, res){
    //do we want to ask for photos?
    var bestmisMatch = {
      "name": "none",
      "photo": "none"
    };

    var userTotal = sum(req.body.scores);
		
    var friendTotal = 0;
	

		
    var farthest = 50;
    //function to loop though array of friends and attempt to find  sum farthest from user sum
    //should only update bestmisMatch when a farther sum is found
    for (var i = 0; i < misfitsList.length; i++) {
      friendTotal = sum(misfitsList[i].scores);
      var difference = Math.abs(friendTotal - userTotal);
      if ( difference >= farthest ){
        farthest = difference;
        bestmisMatch.name = misfitsList[i].name;
        bestmisMatch.photo = misfitsList[i].photo;
        //do we want a photo to be supplied?
      }
    }
    // };

    //function to add the sum from the scores provided by the array obect
    function sum (array) {
      var total = 0;
      for (var n = 0; n < array.length; n++) {
        total += parseInt(array[n]);
      }
      return total;
    }

    //test answer
    console.log(bestmisMatch);
    //return bestmisMatch back to webpage
    res.json(bestmisMatch);
  });

};
