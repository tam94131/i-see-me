//user profile stored here once logged in
let currentUser = {};
//this is a summary of across all the pics
let summaryAllPics = {};
let scoreAllPics;
//array of all pics objects for user
let userPics = [];
const THRESH = 0.65;        //confidence threshold on recogition
const MAXCURATED = 5;


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
        console.log("there was cookie");
        $.ajax({
            method: 'GET',
            url: '/profile/cookie',
            data: userCookie,
            success: logInProfile,
            error: logInError
        })
    } else {
        console.log("there was NO cookie");
        logOut();
    }

    function logInError(a,b,c) {
        console.log("LOGINERROR");
        logOut();
        console.log(a,b,c);
    }

    //If log in error, console log the error. If success, create cookie, and log in the recommendation page
    function logInProfile(json) {
        console.log("LOGIN");
        if (json === "login error") {
            console.log(json, "inside login error");
            alert("Oops! Wrong id or password");
        } else if (json === "cookie fail") {
            console.log("cookie fail");
            console.log("cookie: ", userCookie);
        } else {
            console.log("LOGIN SUCCESS");
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
        console.log("LOGOUT");
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
            $('.jumbotron').hide();
            $('#built-in-content').hide();
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
        console.log("$$0-doReflections",Date());
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
        console.log("$$0-getPicOnSuccess");
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
        userPics.sort(function(a,b) { return new Date(a.time).getTime() - new Date(b.time).getTime() } );

        var bigOlString = '<table border="0">';
        for (var j=0; j<userPics.length; j++) {
            // console.log('---------');
            bigOlString += `
              <tr>
                <td>
                    <a href="${userPics[j].pic}" 
                    alt="${userPics[j].title}" target="_blank">
                    <img src="${userPics[j].pic}" 
                    height="230" class="snapshot"></a>
                </td>
                <td>
                <h3>"${userPics[j].title}"</h3>
                <p>${userPics[j].time}</p>
                ${dispMeta(userPics[j].meta)}
                <p><span class="picExpVal">Experience value: ${userPics[j].score}</span></p>
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
                    var line = "XL0" + land[j].locations[0].latLng.latitude.toString() + "," + land[j].locations[0].latLng.longitude.toString();
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
                    } else if (twoCode==="XL") {
                        returnString += `<p>Location at <span class="locacoord">${metaArray[j].substr(3)}</span></p>`; 
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
// recent.sort(function(a,b) { return new Date(a.start).getTime() - new Date(b.start).getTime() } );

    function showCurated() {
        var curaPics = userPics.slice();
        curaPics.sort(function(a, b){return b.score - a.score});
        var limit = curaPics.length>MAXCURATED ? MAXCURATED : curaPics.length;

        var bigOlString = '<table border="0">';
        for (var j=0; j<limit; j++) {
            // console.log('---------');
            // if (curaPics[j].score!=0) {
              bigOlString += `
              <tr>
                <td>
                    <a href="${curaPics[j].pic}" 
                    alt="${curaPics[j].title}" target="_blank">
                    <img src="${curaPics[j].pic}" 
                    height="150" class="snapshot"></a>
                </td>
                <td>
                <h3>"${curaPics[j].title}"</h3>
                <p>${curaPics[j].time}</p>
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
        console.log("$$1-updatePic");
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
            error: noUpdatedPic
        })
    }

    function updatedPic() {
        console.log("$$2-updatedPic");
        $('#filetoupload').val('');
        $('#picTitle').val('');
        $('#new-pic').hide();
        $('#waiting').html('<img src="../images/waiting.gif">');
        //I know this is a kludge!!!!
        setTimeout(function() {doReflections(currentUser);},6000);
        setTimeout(function() {doReflections(currentUser); $('#waiting').empty(); },12000);
    }

    function noUpdatedPic(a,b,c) {
        console.log("$$2-noUpdatedPic");
        $('#new-pic').hide();
        $('#waiting').html('<img src="../images/waiting.gif">');
        //I know this is a kludge!!!!
        setTimeout(function() {doReflections(currentUser);},6000);
        setTimeout(function() {doReflections(currentUser); $('#waiting').empty(); },12000);
        handleError(a,b,c);
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
    console.log("ERROR!", a, b, c);
}
