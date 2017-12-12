//user profile stored here once logged in
let currentUser = {};
//user pic history stored here once logged in
// let currentPicHistory = {};
//this is a summary of across all the pics
let summaryAllPics = {};
let scoreAllPics = 0;
//array of all pics objects for user
let userPics = [];
//Admin account
// let adminArray = ["tam94131"];
const THRESH = 0.65;        //confidence threshold on recogition

/* CLIENT-SIDE JS*/
$(document).ready(function() {
    //sanity check!
    console.log('app.js loaded!');

    //initiate page 
    hideAll();          //hide panel (doesn't incl jumbotron)
    $('.jumbotron').show();
    $('#built-in-content').show();
    let isLogIn = false;

    //COOKIE LOG IN START
    let userCookie = getCookie("I_SEE_ME_ID");
    // console.log("userCookie: ", userCookie);
    if (userCookie) {
        $.ajax({
            method: 'GET',
            url: '/profile/cookie',
            data: userCookie,
            success: logInProfile,
            error: handleError
        })
        // console.log("after getting profile with cookie log in!!")
    } else {
        logOut();
    }

    //This function handles all the error occured in ajax
    function handleError(a, b, c) {
        console.log(a, b, c);
    }

    //On click listener for log in (sign in) button
    $('#log-in-btn').on('click', function() {
        hideAll();
        $('#log-in-panel').show();
    })

    //On click listener for create button(sign up)
    $('#create-btn').on('click', function() {
        hideAll();
        $('#create-form-panel').show();
    })

    //On click listener for update pic button
    $('#update-pic-btn').on('click', function() {
        $('#new-pic').show();
    })

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

    //Reinitialize the page and kill cookie
    function logOut() {
        killCookie();
        hideAll();
        $('.jumbotron').show();
        $('#built-in-content').show();
        navBarToggle(false);
 //       homepageChart();
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

    //On submit listener for submitting new account data
    $('#create-form').on('submit', createFormOnSubmit);
    //On submit listener for submitting log in request
    $('#log-in-submit').on('submit', logInOnSubmit);
    //On click listener for logging out.
    $('#log-out-btn').on('click', logOut);
    //On submit listener for updating current pic/creating new pic history
    $('#update-pic').on('submit', updatePic);


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
        var bigOlString = '<table border="0">';
        for (var j=0; j<userPics.length; j++) {
            // console.log('---------');
            if (userPics[j].score!=0) {
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
            }
        }
        bigOlString += '</table>';
        $('#curated').html(bigOlString);
    }

    //Send PUT request, change current pic in profile, create new pic history data, then refresh page
    function updatePic(e) {
        e.preventDefault();
        
        console.log("FORM1",e);
        console.log("FORM2",$(this).serialize());
        var file = document.forms['update-pic']['filetoupload'].files[0];
        console.log("FORM3",file.name);
        //file.name == "photo.png"
        //file.type == "image/png"
        //file.size == 300821
        console.log("FORM4",$('input[type=file]').val());
        console.log("FORM4b", $('#filetoupload').val());

        var filename = `filename=${encodeURI($('#filetoupload').val())}`;
        var title = `${$(this).serialize()}`;
        var t = Date();
        timeSerialize = `time=${encodeURI(t)}`;
        requestData = `${filename}&${title}&${timeSerialize}&userId=${currentUser.userId}`;
        console.log("FORM5",requestData);

        $.ajax({
            method: 'POST',
            url: `/pic/fileupload`,
            data: requestData,
            success: updatedPic,
            error: handleError
        })
    }

    function updatedPic() {
        $('#new-pic').hide();
        setTimeout(doReflections(currentUser),6000);
    }

//---------
//On click listener for update fitness goal button
    // $('#update-goal-btn').on('click', function() {
    //     $('#show-goal').hide();
    //     $('#new-goal').show();
    // })

//On submit listener for updating current preferences
    $('#update-goal').on('submit', updateGoal);

// //Send GET request to server and retrieve all profile data
//     function homepageChart(){
//       $.ajax({
//         method: 'GET',
//         url: '/profile/all',
//         success: homepageChartOnSuccess,
//         error: handleError      
//       })
//     }
//Draw scatter chart in homepage using the returned profile data
    // function homepageChartOnSuccess(json){
    //   drawScatter(json);
    // }

//Send PUT request, change current fitness goal, then refresh the recommendation page
    function updateGoal(e) {
        e.preventDefault();
        requestData = `${$(this).serialize()}&userId=${currentUser.userId}`;
        $.ajax({
            method: 'PUT',
            url: `/profile/goal`,
            data: requestData,
            success: logInProfile,
            error: handleError
        })
    }

// //Draw the BMI chart
//     function drawBMI(bmiIn) {
//         google.charts.setOnLoadCallback(drawChart);

//         function drawChart() {
//             var data = google.visualization.arrayToDataTable([
//                 ['Label', 'Value'],
//                 [bmiIn.bmiStr, bmiIn.bmi],
//             ]);
//             var options = {
//                 width: 400,
//                 height: 250,
//                 redFrom: 25,
//                 redTo: 40,
//                 greenFrom: 18,
//                 greenTo: 25,
//                 yellowFrom: 0,
//                 yellowTo: 18,
//                 minorTicks: 5,
//                 max: 35,
//                 min: 12,
//                 yellowColor: 'yellow'
//             };
//             var chart = new google.visualization.Gauge(document.getElementById('bmi-chart'));
//             chart.draw(data, options);
//         }
//     }

//Draw a age/pic scatter chart. Blue dots represent male, and pink represent female
//     function drawScatter(scatterDS) {
//       google.charts.setOnLoadCallback(drawChart);
//       function drawChart(){
//         var dataArray = [['Age', 'Pic', {role:'style'} ]];
//         for (var j=0; j<scatterDS.length; j++) {
//             var age = parseInt(scatterDS[j].age);
//             var pic = parseInt(scatterDS[j].pic);
//             var gender = scatterDS[j].gender.toLowerCase();
//             var genderColor = gender[0]==='m' ? 'blue' : 'pink';
//             var babyArray = [age, pic, 'point { fill-color: ' + genderColor];
//             dataArray.push(babyArray);
//          }
//         var data = google.visualization.arrayToDataTable(dataArray);
//         var options = {
//             title: 'Fitness Guru Community',
//             pointSize: 7,
//             legend: 'none',
//             height: 250, width: 520, 
//             hAxis: {title: 'Age'},
//             vAxis: {title: 'Pic'}
//         };
//         var chart = new google.visualization.ScatterChart(document.getElementById('scatterDiv'));
//         chart.draw(data, options);
//     }   }
// //Draw the pic history chart of current user
//     function drawPic(picIn) {
//         google.charts.setOnLoadCallback(drawChart);
//         function drawChart() {
//             var dataArray = [
//                 ['Date', 'Pic']
//             ];
//             for (var j = 0; j < picIn.length; j++) {
//                 var shortTime = picIn[j].time.substr(4, 6);
//                 shortTime[3] = '-';
//                 var babyArray = [shortTime, parseInt(picIn[j].pic)]
//                 dataArray.push(babyArray);
//             }
//             var data = google.visualization.arrayToDataTable(dataArray);
//             var options = {
//                 title: 'Pic History (lbs)',
//                 curveType: 'function',
//                 pointSize: 7,
//                 series: {
//                     0: { pointShape: 'diamond' }
//                 },
//                 legend: {
//                     position: 'none'
//                 },
//                 height: 250,
//                 width: 520

//             };
//             var chart = new google.visualization.LineChart(document.getElementById('pic-chart'));
//             chart.draw(data, options);
//         }
//     }

//Check if current user is an administrator.
//If true, render admin dashboard. If false, do nothing.
    // function checkAdmin(userIdIn){
    //   var isAdmin = false;
    //   for(var i=0; i<adminArray.length; i++){
    //     if(userIdIn===adminArray[i]){
    //       isAdmin = true;
    //       break;
    //     }
    //   }
    //   if(isAdmin){
    //     renderDashboard();
    //   }
    // }

//Render dashboard(if user is an admin)
    // function renderDashboard(){
    //   $('#admin-panel').show();
    //   $.ajax({
    //     method: 'GET',
    //     url: `profile/all/dashboard`,
    //     success: getDashboardOnSuccess,
    //     error: handleError
    //   })
    // }

    // function getDashboardOnSuccess(json){
    //   console.log(json);
    //   $('#db1').text(json.totalUser);
    //   $('#db2').text(json.totalPic);
    //   $('#db3').text(json.male);
    //   $('#db4').text(json.female);
    //   $('#db5').text(json.other);
    //   $('#db6').text(json.avgPic);
    // }

//Render recommendation page
    // function doReflections1(userProfile) {
    //     getUserData();
    //     userProfile.inch = parseInt(userProfile.inch);
    //     userProfile.feet = parseInt(userProfile.feet);
    //     userProfile.pic = parseInt(userProfile.pic);
    //     hideAll();
    //     checkAdmin(userProfile.userId);
    //     $('#recommendation').show();
    //     $('#show-goal').show();
    //     $('#new-goal').hide();
    //     $('#show-pic').show();
    //     $('#new-pic').hide();
    //     var userPound = parseInt(userProfile.pic);
    //     // This is gonna return {'bmi':bmi,'bmiStr':bmiStr}
    //     var bmiObj = calcBMI(userProfile);
    //     drawBMI(bmiObj);
    //     var recObj = profileToRecomm(userProfile, bmiObj);
    //     $('#rec-resistance').html(recObj.resistance);
    //     $('#rec-cardio').html(recObj.cardio);
    //     $('#rec-nutrition').html(recObj.nutrition);
    //     $('#user-name').text(getFirstName(userProfile.name));
    //     $('#picSpan').text(userPound);
    //     $('#goalSpan').text(userProfile.fitnessGoal.toUpperCase());
    // }



    //---------------------------------
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