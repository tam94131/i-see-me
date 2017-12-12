//user profile stored here once logged in
let currentUser = {};
//this is a summary of across all the pics
let summaryAllPics = {};
let scoreAllPics = 0;
//array of all pics objects for user
let userPics = [];
const THRESH = 0.65;        //confidence threshold on recogition
const MAXCURATED = 5;

//Google Cloud stuff
// const Storage = require('@google-cloud/storage');
// const cred = {
//   "type": "service_account",
//   "project_id": "i-see-me-188119",
//   "private_key_id": "98dc71f42b1e0277098961ca1e2e6400de3c8a1c",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCktzq69TbENkPY\nVnoMKxmokDRPWBOiyl8f47/ICLJYXvqZfj8PckS0wnp1soHSoO7Dazwp3WFJYQ3Y\nSUbQ2Yj5hQvjiLtJf6o927UDibMSpn2wSSv5X39x4sr7s6mvQiyTlUGa0kj5vjxM\nUkDBoWi8074tgAxU/pS1ZJL+2sHInkR1Pltrx+YruDQIdHhH3LSwG3ER3eOANVFd\n7yJXhYcmGzKZ62clxgaa/4h3GfkF2zJBLJ/tJMB4a8Rx5uGmk1gKfO05UlcAUYyF\nDxszGFJBq6DeuEmAPXpx+ktcXQT+tvPQ1a2X/uvU0A+0BP8LoNNkJ5eW7SuTHYKG\nfJz9eyC9AgMBAAECggEAGH4KZJxrzVdIVVXehgquoQr4TEgLe2xeIq7J6KOqaUuO\nNd6438IdB0fXz8KAXWKCvlomsw7xFWkyFtQmjI2cOYYYE3hUaQRruxD9ZI5IK2DI\nVbs7p7QUjkmr5yt68s2DNVq/S5czNLed3bdpW6F1ooZVxAxDSSwlzqcq2GyM3hi1\nQEbDA1fYidrbdsDe+cNwe6a1uLL1Kbh0ge+iPtzNV83Tjisb9VVSJiq0bSnK52c+\nUMkTxsSQQP5brNUZstVdbtMkjmqZLTMeGdWBJOUeskqMKXJ8ywctwZGbhq3CZr7C\ngvJFxMHfKZfecUysmM+0Qs74T8V+kc1nHnyTN/8c/QKBgQDhABLw3qf4QPX465xb\nueZZ/G8eeIMh3wbSvRH2EEoq9wHHlSdsXKu/Etv8OwF8lMcqpM06kSG7/l0MZFUS\n1wmyfBtyWxzLYuxJ2YY6RKepEHep9eccxuueYNpI1yTH4I284ScpQaiem/7SaAYZ\nJVPiCHxXnhIzvyRvycxvXrZnMwKBgQC7aN/83ytVZuZX95xoP2eLdNScYWG/bnAw\ni0Qy2+RSlF2ACN9ZehNU3TRfBxqB0md/HJykfXHFTzH7Wffg8EtoBvHFOS19v+gM\n3uBboKXk+L4bHAa7kOQi0X1lk5urC0TKje/pAK4z6W3Ol1WrkVX6TXol+MFfTBsY\nQbNdVmmYTwKBgQCppMmjLO3OgwQyc0sH6elhbbBGdCzC7AqT+BRDx9J0BJsl5TK9\nRD4GKe0Nh1u+l9p3L5zBjM23lbiIcFmog9P+7A4xsbrLKsHniIfpBPy4vv7KeeqQ\nSvc6CeJrSzOjNI8Jm2VQeP3u4MVH1UDL0tYlNaqy0S7+Lx8E3k0yp2G1+wKBgQCM\nrNqFjFeQ0Z7SJVHIht+ItPfrMsYW1iVsqv1UV+75ddkBhKdzGMluCGWJd2GUVYXO\nyoFij69Y9muESzJgLL/NpHjTHGpjXCwpjRtIbDxatcStwMnk/Yvh/vJrzvMo31qR\n2R1e/13EJdKBIuPx1zR8oK+x1RoCGLS17ote4sB8zQKBgGF3+32MEGMMqhehk9R5\nddECroFbYRg2gtekrSkn3uMjMYhOeGjY3gyG4lD3B4l1or8CLCRrk1ldZqoFV6J3\nRozNJg5RcxmBJ+zIXOlK6pZDU29NSGQyr4uuASgzWHZeaM8UAzw1CgdyOkXcR129\n5mxfY6+kFJpGEX/e3EFHZJ09\n-----END PRIVATE KEY-----\n",
//   "client_email": "i-see-me@i-see-me-188119.iam.gserviceaccount.com",
//   "client_id": "103437408985285771731",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://accounts.google.com/o/oauth2/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/i-see-me%40i-see-me-188119.iam.gserviceaccount.com"
// }
// const projectId = 'i-see-me-188119'; 
// const storage = new Storage({
//     credentials: cred,
//     projectId: projectId
// });
// const bucketName = 'poc_of_vision';



/* CLIENT-SIDE JS*/
$(document).ready(function() {
    //sanity check!
    console.log('app.js loaded!');


    //On click listener for log in (sign in) button
    $('#log-in-btn').on('click', function() {
        hideAll();
        $('#log-in-panel').show();
    });
    //On click listener for create button(sign up)
    $('#create-btn').on('click', function() {
        hideAll();
        $('#create-form-panel').show();
    });
    //On click listener for update pic button
    $('#update-pic-btn').on('click', function() {
        $('#new-pic').show();
    });
    //On submit listener for submitting new account data
    $('#create-form').on('submit', createFormOnSubmit);
    //On submit listener for submitting log in request
    $('#log-in-submit').on('submit', logInOnSubmit);
    //On click listener for logging out.
    $('#log-out-btn').on('click', logOut);
    //On submit listener for updating current pic/creating new pic history
    $('#update-pic').on('submit', updatePic);


    //initiate page 
    hideAll();          //hide panel (doesn't incl jumbotron)
    $('.jumbotron').hide();
    $('#built-in-content').hide();
    let isLogIn = false;

    //COOKIE LOG IN START
    let userCookie = getCookie("I_SEE_ME_ID");
    if (userCookie) {
        $.ajax({
            method: 'GET',
            url: '/profile/cookie',
            data: userCookie,
            success: logInProfile,
            error: logInError
        })
    } else {
        logOut();
    }

    function logInError(a,b,c) {
        logOut();
        console.log(a,b,c);
    }

    //If log in error, console log the error. If success, create cookie, and log in the recommendation page
    function logInProfile(json) {
        if (json === "login error") {
            console.log(json, "inside login error");
            alert("Oops! Wrong id or password");
        } else if (json === "cookie fail") {
            console.log("cookie fail");
            console.log("cookie: ", userCookie);
        } else {
            // console.log(json, "inside render");
            setCookie("I_SEE_ME_ID", `userId=${json.userId}`, 30);
            currentUser = json;
            $('.jumbotron').hide();
            isLogIn = true;
            navBarToggle(true);
            doReflections(currentUser);
        }
    }

    //Reinitialize the page and kill cookie
    function logOut() {
        killCookie();
        hideAll();
        $('.jumbotron').show();
        $('#built-in-content').show();
        navBarToggle(false);
    }
 
    //Send GET request to server. If logged in successfully, go to recommendation page
    function logInOnSubmit(e) {
        e.preventDefault();
        console.log($(this).serialize())
        $.ajax({
            method: 'GET',
            url: '/profile',
            data: $(this).serialize(),
            success: logInProfile,
            error: handleError
        })
        console.log("get request!!!log in!!")
    }

    //Send POST request to server. If new account created, go to recommendation page
    function createFormOnSubmit(e) {
        e.preventDefault();
        var t = Date();
        timeSerialize = `&time=${encodeURI(t)}`;
        requestData = $(this).serialize() + timeSerialize;
        $.ajax({
            method: 'POST',
            url: '/profile',
            data: requestData,
            success: createProfile,
            error: handleError
        })
    }

    //If create error, console log the error. If success, create cookie, and log in the recommendation page
    function createProfile(json) {
        if (json === "exist error") {
            console.log(json);
            alert("id already exists. Please use another one")
        } else {
            console.log(json, "inside render");
            setCookie("I_SEE_ME_ID", `userId=${json.userId}`, 30);
            currentUser = json
            doReflections(currentUser);
            console.log("currentUser: ", currentUser);
            isLogIn = true;
            navBarToggle(true);
        }
    }

    //Call this to show/hide buttons when log in statement changes
    function navBarToggle(loggedIn) {
        if (loggedIn) {
            $('#log-in-btn').hide();
            $('#create-btn').hide();
            $('#log-out-btn').show();
            $('#update-pic-btn').show();
            // isLogIn = true;
        } else {
            $('#log-in-btn').show();
            $('#create-btn').show();
            $('#log-out-btn').hide();
            $('#update-pic-btn').hide();
            // isLogIn = false;
        }
    }


    //Render recommendation page
    function doReflections(userProfile) {
        summaryAllPics.joy = 0;
        summaryAllPics.sorrow = 0;
        summaryAllPics.surprise = 0;
        summaryAllPics.anger = 0;
        summaryAllPics.people = 0;
        summaryAllPics.landmarks = 0;
        summaryAllPics.features = 0;
        scoreAllPics = 0;

        hideAll();
        getUserData();
        $('#user-name').text(getFirstName(userProfile.name));
        $('#recommendation').show();
    }

    //Send GET request to retrieve all pic history of current user
    function getUserData() {
        $.ajax({
            method: 'GET',
            url: `/pic`,
            data: `userId=${currentUser.userId}`,
            success: getPicOnSuccess,
            error: handleError
        })
    }
    
    //ParseInt pic data, then draw the pic history chart of current user
    function getPicOnSuccess(jsonList) {
        userPics = [];      //clear array
        for (var j=0; j<jsonList.length; j++) {
            userRec  = {};      //establish a record
            userRec.title = jsonList[j].title;
            userRec.pic   = jsonList[j].pic;
            userRec.time  = jsonList[j].time.substr(0,24);
            userRec.meta  = parseMeta(jsonList[j].meta);
            userRec.score = calcScore(userRec.meta);
            userPics.push(userRec);
        }
        // console.log("ALL PICS",userPics);
        showSummary();
        showCurated();
        showAllPics();
    }

    function showAllPics() {
        var bigOlString = '<table border="0">';
        for (var j=0; j<userPics.length; j++) {
            // console.log('---------');
            bigOlString += `
              <tr>
                <td>
                    <img src="${userPics[j].pic}" 
                    height="230">
                </td>
                <td>
                <h3>"${userPics[j].title}"</h3>
                <p>${userPics[j].time}</p>
                ${dispMeta(userPics[j].meta)}
                <p>Experience value: ${userPics[j].score}</p>
                </td>
              </tr>`
        }
        bigOlString += '</table>';
        $('#rec-people').html(bigOlString);
    }

    function parseMeta(metaString) {
        var list = [];
        if (metaString) {
        var metaObj = JSON.parse(metaString);
        var metaResponses = metaObj.responses;
        var face = metaResponses[0].faceAnnotations;
        var land = metaResponses[0].landmarkAnnotations;
        var labl = metaResponses[0].labelAnnotations;

        if (land) {
            // console.log("LAND",land);
            for (var j=0; j<land.length; j++) {
                if (land[j].score>THRESH) {
                    var line = "LM2" + land[j].description; 
                    // console.log(line);
                    list.push(line);
                    var line = "XX0" + land[j].locations[0].latLng.latitude.toString() + "," + land[j].locations[0].latLng.longitude.toString();
                    // console.log("$$$",line);
                    list.push(line);
                    summaryAllPics.landmarks++;
                }
            }
        }

        if (face) {
            // console.log("FACE",face);
            for (var j=0; j<face.length; j++) {
                if (face[j].detectionConfidence>THRESH) {
                    // console.log("CONF",face[j].detectionConfidence);
                    summaryAllPics.people++;
                    if (face[j].joyLikelihood === "VERY_LIKELY") {
                        list.push("FJ2");
                        summaryAllPics.joy++;
                    }
                    if (face[j].joyLikelihood === "LIKELY") {
                        list.push("FJ1");
                        summaryAllPics.joy++;
                    }
                    if (face[j].angerLikelihood === "VERY_LIKELY") {
                        list.push("FA2");
                        summaryAllPics.anger++;
                    }
                    if (face[j].angerLikelihood === "LIKELY") {
                        list.push("FA1");
                        summaryAllPics.anger++;
                    }
                    if (face[j].surpriseLikelihood === "VERY_LIKELY") {
                        list.push("FS2");
                        summaryAllPics.surprise++;
                  }
                    if (face[j].surpriseLikelihood === "LIKELY") {
                        list.push("FS1");
                        summaryAllPics.surprise++;
                    }
                    if (face[j].sorrowLikelihood === "VERY_LIKELY") {
                        list.push("FW2");
                        summaryAllPics.sorrow++;
                    }
                    if (face[j].sorrowLikelihood === "LIKELY") {
                        list.push("FW1");
                        summaryAllPics.sorrow++;
                    }
                    if (face[j].headwearLikelihood === "VERY_LIKELY" || face[j].headwearLikelihood === "LIKELY") {
                        list.push("FH0");
                    }
              }
            }
        }

        if (labl) {
            // console.log("LABL",labl);
            for (var j=0; j<labl.length; j++) {
                if (labl[j].score>THRESH) {
                    var line = "XX0" + labl[j].description; 
                    // console.log(line);
                    list.push(line);
                    summaryAllPics.features++;
                }
            }
        }
        }   // if metaString is not null
        return list;
    }

    function calcScore(metaArray) {
        var score = 0;
        for (var j=0; j<metaArray.length; j++) {
            var code = metaArray[j][0];
            var signifStr = metaArray[j][2];
            var signif = parseInt(signifStr);
            if (code==="L") {
                var weight = 2.0;
            } else if (code==="F") {
                var weight = 1.5;
            } else if (code==="X") {
                var weight = 1.0;
            }
            score += weight * signif;
            scoreAllPics += score;
        }
        return score;
    }

    function dispMeta(metaArray) {
        var returnString = "";
        var metaStr = "";
        for (var i=2; i>=0; i--) {
            for (var j=0; j<metaArray.length; j++) {
                if (i.toString()===metaArray[j][2]) {
                    var twoCode = metaArray[j].substr(0,2);
                    // console.log("&&match&&",metaArray[j],twoCode);
                    if (twoCode==="LM") {
                        returnString += `<p>Landmark: ${metaArray[j].substr(3)}</p>`;
                    } else if (twoCode==="FJ") {
                        returnString += `<p>Person expressing joy</p>`;
                    } else if (twoCode==="FA") {
                        returnString += `<p>Person expressing anger</p>`;
                    } else if (twoCode==="FS") {
                        returnString += `<p>Person expressing surprise</p>`;
                    } else if (twoCode==="FW") {
                        returnString += `<p>Person expressing sorrow</p>`;
                    } else if (twoCode==="FH") {
                        returnString += `<p>Person wearing headwear</p>`;
                    } else if (twoCode==="XX") {
                        if (!metaStr) {
                            var metaStr = "Features: " + metaArray[j].substr(3);
                        } else {
                            metaStr += ", " + metaArray[j].substr(3);
                        } 
                    }
                }   //matches signficance 'i'
            }       //loop thru user's meta array
        }           //loop thru significances

        if (metaStr) {
            returnString += `<p>${metaStr}</p>`;
        }
        // console.log("RET",returnString);
        return returnString;
    }

    function showSummary() {
        showStr = `
        <p>Landmarks: ${summaryAllPics.landmarks}</p>
        <p>People (max 3 per): ${summaryAllPics.people}</p>
        <p>..with joy: ${summaryAllPics.joy}</p>
        <p>..with sorrow: ${summaryAllPics.sorrow}</p>
        <p>..with anger: ${summaryAllPics.anger}</p>
        <p>..with surprise: ${summaryAllPics.surprise}</p>
        <p>Recognized features (max 6 per): ${summaryAllPics.features}</p>
        <h3>Combined experience value: ${scoreAllPics}</h3>`
        $('#summary').html(showStr);
    }

    function showCurated() {
        userPics.sort(function(a, b){return b.score - a.score});
        var limit = userPics.length>MAXCURATED ? MAXCURATED : userPics.length;

        var bigOlString = '<table border="0">';
        for (var j=0; j<limit; j++) {
            // console.log('---------');
            // if (userPics[j].score!=0) {
              bigOlString += `
              <tr>
                <td>
                    <img src="${userPics[j].pic}" 
                    height="150">
                </td>
                <td>
                <h3>"${userPics[j].title}"</h3>
                <p>${userPics[j].time}</p>
                </td>
              </tr>`
            // }
        }
        bigOlString += '</table>';
        $('#curatedMax').text(MAXCURATED);
        $('#curated').html(bigOlString);
    }

    //Send PUT request, change current pic in profile, create new pic history data, then refresh page
    function updatePic(e) {
        e.preventDefault();
        
        var filename = $('#filetoupload').val();
        var title    = $('#picTitle').val();
        console.log("$$Form",filename,title);

        var filename  = `filename=${encodeURI(filename)}`;
        var title     = `${$(this).serialize()}`;
        var t = Date();
        timeSerialize = `time=${encodeURI(t)}`;
        requestData = `${filename}&${title}&${timeSerialize}&userId=${currentUser.userId}`;
        console.log("$$Request data",requestData);

        $.ajax({
            method: 'POST',
            url: `/pic/fileupload`,
            data: requestData,
            success: updatedPic,
            error: handleError
        })
    }

    //Send PUT request, change current pic in profile, create new pic history data, then refresh page
    function updatePic1(e) {
        e.preventDefault();
        
        // console.log("FORM1",e);
        // console.log("FORM2",$(this).serialize());
        // var file = document.forms['update-pic']['filetoupload'].files[0];
        // console.log("FORM3",file.path);
        //file.name == "photo.png"
        //file.type == "image/png"
        //file.size == 300821
        // console.log("FORM4",$('input[type=file]').val());
        // var filename = $('#filetoupload').val();
        // console.log("FORM4b", filename);

        var filename = $('#filetoupload').val();
        var title    = $('#picTitle').val();
        console.log("$$Form",filename,title);
        // var title = e.body.req.picTitle;
        // console.log("$$About to store",title,filename);

  // var filename = req.body.filename;
  // var title = req.body.title;
  // var time = req.body.time;
  // var userId = req.body.userId;

  // console.log (filename,title,time,userId);

  // var x = filename.lastIndexOf('\\');
  // // console.log(x);
  // justFilename = filename.substr(x+1);
  // // console.log(filename);
  // var filename = __dirname + '/../tempPics/' + justFilename;
  // console.log("CONT1",filename);

  storage
    .bucket(bucketName)
    .upload(filename)
    .then(() => {
      // addPicToDb(justFilename,title,time,userId);
      // res.send(`${justFilename} uploaded to ${bucketName}.`);
      console.log("SUCCESS",`${justFilename} uploaded to ${bucketName}.`);
    })
    .catch(err => {
      console.error('ERROR upload pic to cloud',err);
    });



        // var filename  = `filename=${encodeURI(filename)}`;
        // var title     = `${$(this).serialize()}`;
        // var t = Date();
        // timeSerialize = `time=${encodeURI(t)}`;
        // requestData = `${filename}&${title}&${timeSerialize}&userId=${currentUser.userId}`;
        // console.log("$$Request data",requestData);

        // $.ajax({
        //     method: 'POST',
        //     url: `/pic/fileupload`,
        //     data: requestData,
        //     success: updatedPic,
        //     error: handleError
        // })
    }

    function updatedPic() {
        $('#new-pic').hide();
        //I know this is a kludge!!!!
        setTimeout(doReflections(currentUser),6000);
        setTimeout(doReflections(currentUser),12000);
    }



    //Hide all layouts in panel-body
    function hideAll() {
        $('#built-in-content').hide();
        $('#create-form-panel').hide();
        $('#log-in-panel').hide();
        $('#recommendation').hide();
        $('#change-profile-form').hide();
        // $('#admin-panel').hide();
    }

    //Set cookie
    function setCookie(cname, cvalue, expireDays) {
        var d = new Date();
        d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    //Get cookie(if there's no matching cookie, return empty string)
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    //Kill cookie
    function killCookie() {
        setCookie("I_SEE_ME_ID", "", 0);
        console.log("killed cookie: ", getCookie("I_SEE_ME_ID"));
    }

    //Get full name, return first name only.
    function getFirstName(nameIn){
       nameIn = nameIn.concat(" ");
       nameArray = nameIn.split(" ");
       return nameArray[0];
    }

});


//This function handles all the error occured in ajax
function handleError(a, b, c) {
    console.log(a, b, c);
}
