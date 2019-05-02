// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3101;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Star Wars Characters (DATA)
// =============================================================
var friends = [
    {
        "name":"Ahmed",
        "photo":"https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/6/005/064/1bd/3435aa3.jpg",
        "scores":[
            5,
            1,
            4,
            4,
            5,
            1,
            2,
            5,
            4,
            1
          ]
      }
];
 

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "app/public/home.html"));
});

app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "app/public/survey.html"));
});

// Displays all friends
app.get("/api/friends", function(req, res) {
  return res.json(friends);
});

app.post("/api/friends", function(req, res) {
    var seenDuplicate = false;
    var score = req.body.scores.reduce(getSum, 0);
    var difference = 50;
    var bestFriend = {};
    
    for (var i = 0; i < friends.length; i++) {
        if (friends[i].name === req.body.name) {
           seenDuplicate = true
        }
        if ((Math.abs(friends[i].scores.reduce(getSum, 0) - score)) < difference) {
            bestFriend = friends[i];
            difference = Math.abs(friends[i].scores.reduce(getSum, 0) - score)
        }
    }

    if (seenDuplicate === false) {
        console.log("pushing");
        friends.push(req.body);
    } else {
        console.log("You have already taken this survey");
    }
    
    res.json(bestFriend);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

function getSum(total, num) {
    return total + Math.round(num);
}