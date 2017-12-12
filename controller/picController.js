const fetchJson = require('node-fetch-json');
// var formidable = require('formidable');
var db = require('../models');

//Google Cloud stuff
const Storage = require('@google-cloud/storage');
const cred = {
  "type": "service_account",
  "project_id": "i-see-me-188119",
  "private_key_id": "98dc71f42b1e0277098961ca1e2e6400de3c8a1c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCktzq69TbENkPY\nVnoMKxmokDRPWBOiyl8f47/ICLJYXvqZfj8PckS0wnp1soHSoO7Dazwp3WFJYQ3Y\nSUbQ2Yj5hQvjiLtJf6o927UDibMSpn2wSSv5X39x4sr7s6mvQiyTlUGa0kj5vjxM\nUkDBoWi8074tgAxU/pS1ZJL+2sHInkR1Pltrx+YruDQIdHhH3LSwG3ER3eOANVFd\n7yJXhYcmGzKZ62clxgaa/4h3GfkF2zJBLJ/tJMB4a8Rx5uGmk1gKfO05UlcAUYyF\nDxszGFJBq6DeuEmAPXpx+ktcXQT+tvPQ1a2X/uvU0A+0BP8LoNNkJ5eW7SuTHYKG\nfJz9eyC9AgMBAAECggEAGH4KZJxrzVdIVVXehgquoQr4TEgLe2xeIq7J6KOqaUuO\nNd6438IdB0fXz8KAXWKCvlomsw7xFWkyFtQmjI2cOYYYE3hUaQRruxD9ZI5IK2DI\nVbs7p7QUjkmr5yt68s2DNVq/S5czNLed3bdpW6F1ooZVxAxDSSwlzqcq2GyM3hi1\nQEbDA1fYidrbdsDe+cNwe6a1uLL1Kbh0ge+iPtzNV83Tjisb9VVSJiq0bSnK52c+\nUMkTxsSQQP5brNUZstVdbtMkjmqZLTMeGdWBJOUeskqMKXJ8ywctwZGbhq3CZr7C\ngvJFxMHfKZfecUysmM+0Qs74T8V+kc1nHnyTN/8c/QKBgQDhABLw3qf4QPX465xb\nueZZ/G8eeIMh3wbSvRH2EEoq9wHHlSdsXKu/Etv8OwF8lMcqpM06kSG7/l0MZFUS\n1wmyfBtyWxzLYuxJ2YY6RKepEHep9eccxuueYNpI1yTH4I284ScpQaiem/7SaAYZ\nJVPiCHxXnhIzvyRvycxvXrZnMwKBgQC7aN/83ytVZuZX95xoP2eLdNScYWG/bnAw\ni0Qy2+RSlF2ACN9ZehNU3TRfBxqB0md/HJykfXHFTzH7Wffg8EtoBvHFOS19v+gM\n3uBboKXk+L4bHAa7kOQi0X1lk5urC0TKje/pAK4z6W3Ol1WrkVX6TXol+MFfTBsY\nQbNdVmmYTwKBgQCppMmjLO3OgwQyc0sH6elhbbBGdCzC7AqT+BRDx9J0BJsl5TK9\nRD4GKe0Nh1u+l9p3L5zBjM23lbiIcFmog9P+7A4xsbrLKsHniIfpBPy4vv7KeeqQ\nSvc6CeJrSzOjNI8Jm2VQeP3u4MVH1UDL0tYlNaqy0S7+Lx8E3k0yp2G1+wKBgQCM\nrNqFjFeQ0Z7SJVHIht+ItPfrMsYW1iVsqv1UV+75ddkBhKdzGMluCGWJd2GUVYXO\nyoFij69Y9muESzJgLL/NpHjTHGpjXCwpjRtIbDxatcStwMnk/Yvh/vJrzvMo31qR\n2R1e/13EJdKBIuPx1zR8oK+x1RoCGLS17ote4sB8zQKBgGF3+32MEGMMqhehk9R5\nddECroFbYRg2gtekrSkn3uMjMYhOeGjY3gyG4lD3B4l1or8CLCRrk1ldZqoFV6J3\nRozNJg5RcxmBJ+zIXOlK6pZDU29NSGQyr4uuASgzWHZeaM8UAzw1CgdyOkXcR129\n5mxfY6+kFJpGEX/e3EFHZJ09\n-----END PRIVATE KEY-----\n",
  "client_email": "i-see-me@i-see-me-188119.iam.gserviceaccount.com",
  "client_id": "103437408985285771731",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/i-see-me%40i-see-me-188119.iam.gserviceaccount.com"
}
const projectId = 'i-see-me-188119'; 
const storage = new Storage({
    credentials: cred,
    projectId: projectId
});
const bucketName = 'poc_of_vision';

//Not getting:
// SAFE_SEARCH_DETECTION
// WEB_DETECTION
var featuresTemplate = [
        {
          "type": "FACE_DETECTION",
          "maxResults": 3
        },
        {
          "type": "LANDMARK_DETECTION",
          "maxResults": 1
        },
        {
          "type": "LABEL_DETECTION",
          "maxResults": 6
        }
      ];


//GET request for ALL pic history of current user
function getPicHistory(req, res){
    var userIdIn = req.query.userId;
    // console.log("getPicHistory",userIdIn);
    db.Pic.find({userId:userIdIn},function(err, success){
        if(err){return err}
        if(!success){
            res.send("This should not happen since the user should be logged in to reach this function.")
        } else {
            if (success.length>0) {
                for (var j=0; j<success.length; j++) {
                    if (success[j].meta.length<10) {
                        var newItem = { requests: [{
                            image: {
                                source: {
                                    imageUri: success[j].pic 
                                }
                            },
                            features: featuresTemplate
                        }]};
                        console.log("GET META",success[j],newItem);
                        var meta = getMetaData(newItem, success[j]);
                    }   //this pic needs meta data
                }       //loop thru all pics for user
            }       //whether user has any pics
            res.send(success);
        }   // find was successful
    })
}

function getMetaData(reqObj,picRecord) {

    fetchJson('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCVTT0MkBChcgfkiKnMKeAp29nl7_Bz6x0', {
        body: reqObj, // content to be JSON stringified
        headers: {
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        method: 'POST',
    })
    .then((response) => {
        console.log("Google Vision API success",JSON.stringify(response));
        updateMeta(picRecord,JSON.stringify(response));
        return JSON.stringify(response);
    })
    .catch((err) => {
        console.log("Google API call failure",err);
        return "";
    });
}

function updateMeta(picRecord,metaData) {
    console.log("IN UPDATE META", picRecord);
    db.Pic.update({ _id: picRecord._id },{meta:metaData}, function(err,success){
      if(err){return err};
      if(!success){console.log("record not found")}
      console.log("changed meta: ", success);
    })
}


function fileUpload(req,res) {
  var filename = req.body.filename;
  var title = req.body.title;
  var time = req.body.time;
  var userId = req.body.userId;

  console.log (filename,title,time,userId);

  var x = filename.lastIndexOf('\\');
  // console.log(x);
  justFilename = filename.substr(x+1);
  // console.log(filename);
  var filename = __dirname + '/../tempPics/' + justFilename;
  console.log("CONT1",filename);

  storage
    .bucket(bucketName)
    .upload(filename)
    .then(() => {
      addPicToDb(justFilename,title,time,userId);
      res.send(`${justFilename} uploaded to ${bucketName}.`);
      console.log("SUCCESS",`${justFilename} uploaded to ${bucketName}.`);
    })
    .catch(err => {
      console.error('ERROR upload pic to cloud',err);
    });
}

function fileUpload1(req,res) {
  console.log("CONT2",req.body);

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
      console.log("1",err);
      console.log("2",fields);
      console.log("3",files);
      // var oldpath = files.filetoupload.path;
      // var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
      // fs.rename(oldpath, newpath, function (err) {
      //   if (err) throw err;
      //   res.write('File uploaded and moved!');
      //   res.end();
  });



  // var form = new formidable.IncomingForm();
  // form.parse(req)
  //   .on('file', function(name, file) {
  //       console.log('Got file:', name);
  //   })
  //   .on('field', function(name, field) {
  //       console.log('Got a field:', name);
  //   })
  //   .on('error', function(err) {
  //       next(err);
  //   })
  //   .on('end', function() {
  //       res.end();
  //   });

}

function addPicToDb(filename,title,time,userId) {
  console.log("PIC UPLOADED NOW ADDING TO DB", filename);
  var newPic = new db.Pic({
    pic: 'https://storage.googleapis.com/' + bucketName + '/' + filename,
    title: title,
    meta: "",
    time: time,
    userId: userId
  });
  newPic.save(function(err, success) {
    if (err) {return console.log(err);}
    console.log("SAVED new Pic: ", title, " in Pic database");
    return success;
  })
}


module.exports = {
    getPicHistory: getPicHistory,
    fileUpload: fileUpload
};