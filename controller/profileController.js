var db = require('../models');
//Implementing bcrypt for authentication
var bcrypt = require('bcrypt');

//GET request for logging in using cookie.
function cookieLogIn(req, res){
    db.Profile.findOne({
        userId: req.query.userId
    }, function(err, success) {
        if (err) {return res.send(err)}
        if(!success){
          res.send("cookie fail");
        }else{
          console.log("cookie success");
          res.json(success);
      }
    })
}

//POST request for creating a new account.
function create(req, res) {
    db.Profile.findOne({
        userId: req.body.userId
    }, function(err, success) {
        if (success) {
            res.send("exist error");
            return;
        } else {
            const saltRounds = 10;
            bcrypt.hash(req.body.pwd, saltRounds, function(err, hash) {
                if (err) {console.log(err)}
                var newProfile = new db.Profile({
                    name: req.body.name,
                    userId: req.body.userId,
                    filter: req.body.filter,
                    preferences: req.body.preferences,
                    token: hash
                })
                // var timeIn = decodeURI(req.body.time);
                // var newPic = new db.Pic({
                //     userId: req.body.userId,
                //     time: timeIn,
                //     pic: req.body.pic
                // })
                // // console.log(newProfile);
                // newPic.save(function(err, success) {
                //     if (err) {return console.log(err)}
                //     console.log("saved newPic: ", newPic, " in Pic database");
                // })
                newProfile.save(function(err, success) {
                    if (err) {return console.log(err);}
                    res.json(success);
                    console.log("saved newProfile: ", newProfile, " in Profile database");
                })
            })
        }
    });
}

//GET request for logging in.
function logIn(req, res) {
    var passwordIn = req.query.pwd;
    console.log("got login request pwd: ", passwordIn);
    db.Profile.findOne({
        userId: req.query.userId
    }, function(err, success) {
        if (err) {return res.send(err)}
        if(!success){
          res.send("login error");
        }else{
        console.log("success.token: ", success.token)
        bcrypt.compare(passwordIn, success.token, function(err, isMatch) {
            if (err) {
                console.log(err)
            }
            console.log("isMatch: ", isMatch);
            console.log(success)
            if (isMatch) {
                res.json(success);
            } else {
                res.send("login error");
            }
        })
      }
    })
}




//--------------------------

//PUT request for add user pic in his Profile data and create a Pic data history.
//*************** NOT CURRENTLY USED ****************
function updatePic(req, res){
  console.log("req.body: ", req.body)
    db.Profile.updateOne({userId:req.body.userId},{pic:req.body.pic}, function(err,success){
      if(err){return err};
      if(!success){console.log("user not found")}
      console.log("changed pic: ", success);
      db.Profile.findOne({userId:req.body.userId},function(err,success){
        if(err){return err};
        if(!success){console.log("this shouldn't happen")}
        else{
          var timeIn = decodeURI(req.body.time);
                var newPic = new db.Pic({
                    userId: req.body.userId,
                    time: timeIn,
                    pic: req.body.pic
                })
                // console.log(newProfile);
                newPic.save(function(err, success) {
                    if (err) {
                        return console.log(err)
                    }
                    console.log("newPic: ", newPic);
                })
          res.json(success);
        }
      })
    })
}

//PUT request for updating user preferences.
//***************** NOT CURRENTLY USED *****************
function updatePreferences(req, res){
  console.log("req.body: ", req.body)
    db.Profile.updateOne({userId:req.body.userId},{preferences:req.body.preferences}, function(err,success){
      if(err){return err};
      if(!success){console.log("user not found")}
      console.log("changed preferences: ", success);
      db.Profile.findOne({userId:req.body.userId},function(err,success){
        if(err){return err};
        if(!success){console.log("this shouldn't happen")}
        else{
          res.json(success);
        }
      })
    })
}


//GET request for all profile(for the scatter chart).
function getAll(req, res){
  db.Profile.find({}, function(err, all){
    if(err){return console.log(err)}
    res.json(all);
  })
}

//GET request for all profile(for the admin dashboard).
function getDashboard(req, res){
  var jsonReturn = {};
  var male = 0;
  var female = 0;
  var other = 0;
  db.Profile.find({}, function(err, all){
    if(err){return console.log(err)}
    jsonReturn.totalUser=all.length;
    db.Pic.find({}, function(err, allPic){
      if(err){return console.log(err)}
      jsonReturn.totalPic = allPic.length;
      var avgPic = 0;
      allPic.forEach(function(person){
        avgPic = avgPic+parseInt(person.pic);
      })
      avgPic = avgPic / allPic.length;
      jsonReturn.avgPic = parseInt(avgPic);
      db.Profile.find({gender:"male"}, function(err, allMale){
        if(err){return console.log(err)}
        if(allMale){male=allMale.length;}
        db.Profile.find({gender:"female"}, function(err, allFemale){
          if(err){return console.log(err)}
          if(allFemale){female=allFemale.length;}
          db.Profile.find({gender:"other"}, function(err, allOther){
            if(err){return console.log(err)}
            if(allOther){other=allOther.length;}
            var malePercentage = Math.round(male/(male+female+other)*100);
            var femalePercentage = Math.round(female/(male+female+other)*100);
            var otherPercentage = Math.round(other/(male+female+other)*100);
            jsonReturn.male = malePercentage || 0;
            jsonReturn.female = femalePercentage || 0;
            jsonReturn.other = otherPercentage || 0;
            res.json(jsonReturn);
          })
        })
      })
    })
  })
}

module.exports = {
    cookieLogIn: cookieLogIn,
    updatePic: updatePic,
    updatePreferences: updatePreferences,
    create: create,
    logIn: logIn,
    getAll: getAll,
    getDashboard: getDashboard
};