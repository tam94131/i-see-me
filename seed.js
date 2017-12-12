// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.
//seed.js

var db = require("./models");
var controller = require('./controller');

  // userId: String,
  // title: String,
  // time: String,
  // pic: String,
  // meta: String

var picList = [
  {
    "userId": "joeblow", 
    "title":  'Some dog',
    "meta":   "thing",
    "pic":    'https://storage.googleapis.com/poc_of_vision/demo-image.jpg',
    "time":   "Thu Oct 01 2017 12:25:11 GMT-0700 (PDT)"
  },
  {
    "userId": "tam94131",     
    "title":  'Fort Point',
    "meta":   "place",
    "pic":    'https://storage.googleapis.com/poc_of_vision/Fort-Point.jpg',
    "time":   "Thu Oct 01 2017 12:25:11 GMT-0700 (PDT)"
  },
  {
    "userId": "tam94131", 
    "title":  'Conference presentation',
    "meta":   "people",
    "pic":    'https://storage.googleapis.com/poc_of_vision/goo.jpg',
    "time":   "Thu Oct 01 2017 12:25:11 GMT-0700 (PDT)"
  },
  {
    "userId": "tam94131", 
    "title":  'At Olympia',
    "meta":   "people",
    "pic":    'https://storage.googleapis.com/poc_of_vision/hoo.jpg',
    "time":   "Thu Oct 15 2017 12:25:11 GMT-0700 (PDT)"
  },
  {
    "userId": "tam94131", 
    "title":  'Cajun festival',
    "meta":   "people",
    "pic":    'https://storage.googleapis.com/poc_of_vision/koo.jpg',
    "time":   "Thu Oct 15 2017 12:25:11 GMT-0700 (PDT)"
  },
  { 
    "userId": "tam94131", 
    "title":  'In the kitchen',
    "meta":   "people",
    "pic":    'https://storage.googleapis.com/poc_of_vision/moo.jpg',
    "time":   "Thu Oct 15 2017 12:25:11 GMT-0700 (PDT)"
  },
  {
    "userId": "tam94131", 
    "title":  'Pair of us',
    "meta":   "people",
    "pic":    'https://storage.googleapis.com/poc_of_vision/pair.jpg',
    "time":   "Thu Oct 15 2017 12:25:11 GMT-0700 (PDT)"
  },
  {
    "userId": "tam94131", 
    "title":  'Hiroki eating',
    "meta":   "thing",
    "pic":    'https://storage.googleapis.com/poc_of_vision/Hiroki-eating.jpg',
    "time":   "Thu Oct 15 2017 12:25:11 GMT-0700 (PDT)"
  }
];

  // name: String,
  // userId: String,
  // filter: String,
  // preferences: String,
  // token: String

var profileList = [
{"name":"1",      "userId":"john22",    "filter":"26", "preferences":"none", "token":"1"},
{"name":"2",      "userId":"kelvin01",  "filter":"36", "preferences":"none", "token":"1"},
{"name":"3",      "userId":"dave33",    "filter":"37", "preferences":"verbose", "token":"1"},
{"name":"4",      "userId":"joeblow",   "filter":"43", "preferences":"verbose", "token":"1"},
{"name":"5",      "userId":"jack3",     "filter":"66", "preferences":"verbose", "token":"1"},
{"name":"6",      "userId":"ken22",     "filter":"43", "preferences":"none", "token":"1"},
{"name":"7",      "userId":"bill3",     "filter":"22", "preferences":"terse", "token":"1"},
{"name":"kay00",  "userId":"kay00",     "filter":"24", "preferences":"none", "token":"1"},
{"name":"alex33", "userId":"alex33",    "filter":"25", "preferences":"terse", "token":"1"},
]

db.Pic.remove({}, function(err, success) {
    // code in here runs after all pics are removed
    db.Pic.create(picList, function(err, pic) {
        console.log("created ", pic.length, " pic history");
        db.Profile.remove({}, function(err, success) {
            // code in here runs after all profiles are removed
            db.Profile.create(profileList, function(err, profile) {
                console.log("created ", profile.length, " profile history");
                process.exit();
            });
        });
    });
});
