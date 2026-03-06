/*  
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or$("#log-box").append("<br>"+data+"<br>");
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
	
  Authors: Fred Decker
             Mani Kumar
             Matt
             Peter Akers
       
    This is part of the DCC-EX Project for model railroading and more.
  For more information, see us at dcc-ex.com.
*/
window.cv = 0;
window.speed = 0;
window.direction = 1;
window.server = "";
window.port = 4444;
window.speedStep = 1;
window.functions = {
  "f0": 0,
  "f1": 0,
  "f2": 0,
  "f3": 0,
  "f4": 0,
  "f5": 0,
  "f6": 0,
  "f7": 0,
  "f8": 0,
  "f9": 0,
  "f10": 0,
  "f11": 0,
  "f12": 0,
  "f13": 0,
  "f14": 0,
  "f15": 0,
  "f16": 0,
  "f17": 0,
  "f18": 0,
  "f19": 0,
  "f20": 0,
  "f21": 0,
  "f22": 0,
  "f23": 0,
  "f24": 0,
  "f25": 0,
  "f26": 0,
  "f27": 0,
  "f28": 0,
  "f29": 0,
  "f30": 0,
  "f31": 0
};
window.isStopped = true;
window.isDirectionToggleStopped = false;
let port;
let emulatorMode;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

let pressed = false;

window.lastLocoSent = -1;
window.lastSpeedSent = -1;
window.lastDirSent = -1;
window.lastTimeSent = new Date();
window.lastTimeReceived = new Date();
window.lastLocoReceived = -1;
window.lastSpeedReceived = -1;
window.lastDirReceived = -1;

window.DIRECTION_FORWARD = 1;
window.DIRECTION_REVERSED = 0;

window.csVersion = 5;
window.csIsReady = false;
window.csIsReadyRequestSent = false;

window.rosterRequested = false;
window.rosterComplete = false;
window.rosterCount = 0;
window.rosterIds = [];
window.rosterNames = [];
window.rosterFunctions = [];
window.rosterFunctionsJSON = [];
window.rosterJSON = "";

window.routesRequested = false;
window.routesComplete = false;
window.routesCount = 0;
window.routesIds = [];
window.routesNames = [];
window.routesTypes = [];
window.routesStates = [];
window.routesLabels = [];
window.routesJSON = "";

window.turnoutsRequested = false;
window.turnoutsComplete = false;
window.turnoutsCount = 0;
window.turnoutsIds = [];
window.turnoutsNames = [];
window.turnoutsStates = [];
window.turnoutsJSON = "";

window.addEventListener("load", function () {
  ToastMaker('Click the [Connect EX-CS] button to connect to your Command Station!', 8000);
});

// Enables and disables ui elements

function uiDisable(status) {
  /*document.getElementById('ex-locoid').disabled = status
  document.getElementById('power-switch').disabled = status
  document.getElementById('button-sendCmd').disabled = status
  document.getElementById('dir-f').disabled = status
  document.getElementById('dir-S').disabled = status*/
  //document.getElementById('dir-b').disabled = status
  $("#power-switch").prop('disabled', status)
  $("#button-sendCmd").prop('disabled', status)
  if (status) {
    $("#ex-locoid").prop('disabled', status)
    $("#button-getloco").prop('disabled', status)
    $("#button-getloco").addClass("ui-state-disabled")
    $("#button-sendCmd").addClass("ui-state-disabled")
    $("#cmd-direct").addClass("ui-state-disabled")
    $("#ex-locoid").addClass("ui-state-disabled")
    $("#power-switch").parent().addClass("ui-state-disabled")
    $("#dir-f").parent().addClass("ui-state-disabled")
    $("#emergency-stop").addClass("ui-state-disabled")
    $("#normal-stop").addClass("ui-state-disabled")
    $("#button-right").addClass("ui-state-disabled")
    $("#button-left").addClass("ui-state-disabled")
    for (i = 0; i <= 31; i++) {
      $("#f" + i).addClass("ui-state-disabled")
    }

    $("#button-cv-read-loco-id").prop('disabled', status)
    $("#button-cv-read-loco-id").addClass("ui-state-disabled")
    $("#button-cv-write-loco-id").prop('disabled', status)
    $("#button-cv-write-loco-id").addClass("ui-state-disabled")
    $("#button-cv-read-cv").prop('disabled', status)
    $("#button-cv-read-cv").addClass("ui-state-disabled")
    $("#button-cv-write-cv").prop('disabled', status)
    $("#button-cv-write-cv").addClass("ui-state-disabled")
  } else {
    // $("#button-getloco").removeClass("ui-state-disabled")
    // $("#button-sendCmd").removeClass("ui-state-disabled")
    $("#cmd-direct").removeClass("ui-state-disabled")
    $("#ex-locoid").removeClass("ui-state-disabled")
    $("#power-switch").parent().removeClass("ui-state-disabled")
    $("#dir-f").parent().removeClass("ui-state-disabled")
    $("#emergency-stop").removeClass("ui-state-disabled")
    $("#normal-stop").removeClass("ui-state-disabled")
    $("#button-right").removeClass("ui-state-disabled")
    $("#button-left").removeClass("ui-state-disabled")
    for (i = 0; i <= 31; i++) {
      $("#f" + i).removeClass("ui-state-disabled")
    }

    // $("#button-cv-read-loco-id").prop('disabled', status)
    // $("#button-cv-read-loco-id").removeClass("ui-state-disabled")
    // $("#button-cv-write-loco-id").prop('disabled', status)
    // $("#button-cv-write-loco-id").removeClass("ui-state-disabled")
    // $("#button-cv-read-cv").prop('disabled', status)
    // $("#button-cv-read-cv").removeClass("ui-state-disabled")
    // $("#button-cv-write-cv").prop('disabled', status)
    // $("#button-cv-write-cv").removeClass("ui-state-disabled")
  }

  $("#dir-f").prop('disabled', status)
  // $("#dir-S").prop('disabled', status)
  $("#dir-b").prop('disabled', status)
  if (status) {
    //$("#throttle").roundSlider("disable");
    //toggleThrottleState(false)
    $("#button-getloco").trigger("click");
  } else {
    //$("#throttle").roundSlider("enable");
    //toggleThrottleState(true)
    //$("#button-getloco").trigger("click");
  }
}

function uiEnableThrottleControlOnReady() {
  displayLog('<br><br>[i] EX-CommandStation is READY<br>');
  $("#button-getloco").removeClass("ui-state-disabled");
  $("#button-sendCmd").removeClass("ui-state-disabled");
  $("#ex-locoid").prop('disabled', false)
  $("#button-getloco").prop('disabled', false)
  $("#button-cv-read-loco-id").prop('disabled', false)
  $("#button-cv-read-loco-id").removeClass("ui-state-disabled")
  $("#button-cv-write-loco-id").prop('disabled', false)
  $("#button-cv-write-loco-id").removeClass("ui-state-disabled")
  $("#button-cv-read-cv").prop('disabled', false)
  $("#button-cv-read-cv").removeClass("ui-state-disabled")
  $("#button-cv-write-cv").prop('disabled', false)
  $("#button-cv-write-cv").removeClass("ui-state-disabled")
}

// Returns given function current value (0-disable/1-enable)
function getFunCurrentVal(fun) {
  return window.functions[fun];
}
// Set given function current value with given value (0/1)
function setFunCurrentVal(fun, val) {
  window.functions[fun] = val;
}
// Set given CV value
function setCV(val) {
  window.cv = val;
  console.log("Set Cab Address: " + val);
}
// Get stored CV value
function getCV() {
  return window.cv
}

// Set Speed value
function setSpeed(sp) {
  window.speed = sp;
}

// Get Speed value
function getSpeed() {
  return parseInt(window.speed);
}

// Set Direction 
function setDirection(dir) {
  window.direction = dir;
}

// Get Direction value
function getDirection() {
  return window.direction;
}

// Handling Disabling functionality for Knob Type throttle (it will not Out of the box) 
function toggleKnobState(ele, state) {
  if (!state) {
    ele.addClass("disabled");
  } else {
    ele.removeClass("disabled");
  }
}


function loadMapData(map) {
  loadMapData(map, false);
}

function loadMapData(map, fromRoster) {
  data = [];
  if (map.toLowerCase() == "default") {
    data = { mname: "Default", fnData: fnMasterData };
  } else {
    if (!fromRoster) {
      data = getStoredMapData(map);
    } else {
      data = getRosterMapData(map);
    }
  }
  $("#mapping-panel").empty();
  $("#mapping-panel").append(
    '<div class="settings-subheading row">' +
    '<div class="column-7 pl0"><div class="map-name-heading">' +
    map +
    "</div></div>" +
    '<div class="column-3 pr0">' +
    '<input type="hidden" id="cur-map-val" cur-map="' + map + '"/>' +
    '<a href="#" class="option-btn waste-bin" id="delete-map"> &#128465;</a>' +
    '<a href="#" class="option-btn" id="import-map"> &#8595;</a>' +
    '<a href="#" class="option-btn" id="export-cur-map"> &#8593;</a>' +
    '<a href="#" class="option-btn" id="edit-cur-map">&#9998;</a>' +
    "</div>" +
    "</div>"
  );
  $("#mapping-panel").append(
    '<div class="row settings-group fnhead">' +
    '<div class="column-2">Function</div>' +
    '<div class="column-4">Name</div>' +
    '<div class="column-2">Type</div>' +
    '<div class="column-2">Visible</div>' +
    '</div>'
  );
  container = $('<div class="maps-content"></div>').appendTo("#mapping-panel");
  $.each(data.fnData, function (key, value) {
    container.append(
      '<div class="row settings-group" id="' + key + '">' +
      '<div class="column-2 caplitalize">' + key + '</div>' +
      '<div class="column-4">' + value[2] + '</div>' +
      '<div class="column-2">' + (value[1] == 1 ? '<span class="pill red">Momentary</span>' : '<span class="pill green">Latching</span>') + '</div>' +
      '<div class="column-2">' + (value[3] == 1 ? '<span class="pill green">Visible</span>' : '<span class="pill">Hidden</span>') + '</div>' +
      '</div>'
    );
  });

  csRosterString = '<p><small>Roster Entry needed if added to your myConfiguration.h file:<br />ROSTER(loco_id,\"loco_name\",\"'
  i=0;
  $.each(data.fnData, function (key, value) {
    if (value[3] == 1) {
      csRosterString = csRosterString +
        (value[1] == 1 ? "*" : "") +
        value[2] +
        (i<31 ? '/' : '')
      ;
    }
    i++;
  });
  csRosterString = csRosterString + '\")' + '</small></p>';
  container.append(csRosterString);

}


function loadLocomotives() {
  locos = getLocoList();
  combinedLocoList = getCombinedLocoList();
  $("#locomotives-panel").empty();
  $.each(locos, function (key, value) {
    $("#locomotives-panel").append(
      '<div class="row settings-group" id="' + key + '">' +
        '<div class="column-1 sno"><p>' + (key + 1) + "</p></div>" +
        '<div class="column-7 loco-details">' +
          '<div class="row">' +
            '<div class="column-7"><p class="ac-loco-name column-10">' + value.name + "</p></div>" +
            '<div class="column-2 cv-num"><p><small>Addr </small>' + value.cv + "</p></div>" +
        "</div>" +
        '<div class="row sub-text">' +
          '<div class="column-3"><p>' + value.type + '</p></div>' +
            '<div class="column-3">' + (value.decoder == "" ? '<p class="nd">Undefined</p>' : "<p>" + value.decoder + "</p>") +
          "</div>" +
          '<div class="column-3">' + (value.brand == "" ? '<p class="nd">Undefined</p>' : "<p>" + value.brand + "</p>") +
          '</div>' +
        '</div>' + 
      '</div>' +
      '<div class="column-2 asst-map"><div class="row">' +
        '<div class="column-7"><p class="muted">Map</p><p>' + value.map + "</p></div>" +
        '<div class="column-3 prh"><a href="#" loco-id="' + key + '" data-loco="' + value.name + '" class="edit-cur-loco"> &#9998; </a></div>' +
      '</div>' +
    '</div></br>'
    );
  });
}

function loadRoutes() {
  routes = getRoutesList();
  $("#routes-panel").empty();
  $.each(routes, function (key, value) {
    if (value.state!="2") { // not hiddden
      rslt = 
        '<div class="row routes-group" id="' + key + '">' +
          '<div class="column-1 sno"><p>' + (key + 1) + "</p></div>" +
          '<div class="column-5"><p class="ac-route-name column-10">' + value.name + "</p></div>" +
          '<div class="column-2 cv-num"><p><small>Id </small>' + value.id + "</p></div>" +
          '<div class="column-1"><p>' + value.type + '</p></div>';
        rslt =rslt + '<div class="column-1 prh"><a href="#" route-id="' + value.id + '" data-route="' + value.name + '" class="run-cur-route"';
        if (value.state=="1") // enabled
          rslt = rslt + ' style="color:#00A3B9;"'
        rslt = rslt + '>' + value.label + '</a></div>';
        rslt = rslt + "</div>"
        $("#routes-panel").append(rslt);
    }
  });
}

function loadTurnouts() {
  turnouts = getTurnoutsList();
  $("#turnouts-panel").empty();
  $.each(turnouts, function (key, value) {
    $("#turnouts-panel").append(
      '<div class="row turnouts-group" id="' + key + '">' +
        '<div class="column-1 sno"><p>' + (key + 1) + "</p></div>" +
        '<div class="column-4"><p class="ac-turnout-name column-10">' + value.name + "</p></div>" +
        '<div class="column-2 cv-num"><p><small>Id </small>' + value.id + "</p></div>" +
        '<div class="column-1"><p>' + turnoutStateText(value.state) + '</p></div>' +
        '<div class="column-1 prh"><a href="#" turnout-id="' + value.id + '" data-turnout="' + value.name + '" class="throw-cur-turnout"> Throw </a></div>' +
        '<div class="column-1 prh"><a href="#" turnout-id="' + value.id + '" data-turnout="' + value.name + '" class="close-cur-turnout"> Close </a></div>' +
      "</div>"
    );
  });
}

//Initialization routine for Throttle screen
function setThrottleScreenUI() {
  loadmaps();
  loadButtons({ mname: "default", fnData: fnMasterData });
  uiDisable(true);
  controller = getPreference("scontroller");
  $("#throttle-selector").val(controller).trigger("change");
  setspeedControllerType(controller);

  // Show and hide debug console based on preference set in earlier session
  if (getPreference("dbugConsole") == null) {
    setPreference("dbugConsole", true);
  }
  if (getPreference("dbugConsole")) {
    $("#debug-console").show()
    $("#console-toggle").prop("checked", true);
  } else {
    $("#debug-console").hide();
    $("#console-toggle").prop("checked", false);
  }
  if (getPreference("timestamp") == null) {
    setPreference("timestamp", "off");
  }
  $("#timestamp-selector").val(getPreference("timestamp")).trigger("change");

  $(".dir-toggle").addClass("forward");

  // Set theme
  if (getPreference("theme") == null) {
    setPreference("theme", "simple");
  } else {
    theme = getPreference("theme");
    $("#theme-selector").val(theme).trigger("change");
    if (theme != "simple") {
      $("link[title*='theme']").remove();
      $("head").append(
        '<link rel="stylesheet" type="text/css" title="theme" href="css/themes/' + theme + '.css">'
      );
    }
  }
  console.log('EX-WebThrottle - version: ' + version);
  displayLog('[i] EX-WebThrottle - version: ' + version);
  displayLog(browserType());
  displayLog('');
}

// Change the Speed controller type
function setspeedControllerType(pref) {
  // Set saved throttle or use circular throttle as default
  $(".speedController").hide();
  switch (pref) {
    case "vertical":
      console.log("Vertical Speed Controller");
      $("#vertical-throttle").show();
      break;
    case "knob":
      console.log("Knob Speed Controller");
      $("#knobthrottle").show();
      break;
    case "circular":
      console.log("Circular Speed Controller");
      $("#circular-throttle").show();
      break;
    case "default":
    case null:
    case undefined:
      console.log("Fallback Speed Controller");
      $("#vertical-throttle").show();
      setPreference("scontroller", "vertical");
      $("#throttle-selector").val("vertical").trigger("change");
  }
}

// Enabling/disabling Speed Controllers
function toggleThrottleState(state) {
  if (state) {
    $("#circular-throttle").roundSlider("enable");
    $("#v-throttle").slider("enable");
    $("#button-right").removeClass("ui-state-disabled")
    $("#button-left").removeClass("ui-state-disabled")
    // $("#button-right").button("enable");
    // $("#button-left").button("enable");
    toggleKnobState($("#knobthrottle"), true);
  } else {
    $("#circular-throttle").roundSlider("disable");
    $("#v-throttle").slider("disable");
    $("#button-right").addClass("ui-state-disabled")
    $("#button-left").addClass("ui-state-disabled")
    // $("#button-right").button("disable");
    // $("#button-left").button("disable");
    toggleKnobState($("#knobthrottle"), false);
    setSpeed(0);
    setPositionofControllers(0);
  }
}

/********************************************************** 
 * This function will
    1. Send Speed command
    2. Set speed value of all the available sliders/controllers
    3. Set respctive speed number 
************************************************************/
function setSpeedofControllers() {
  // displayLog('setSpeedofControllers()');
  spd = getSpeed();

  if (!isStopped) {
    // writeToStream("t " + getCV() + " " + spd + " " + getDirection());
    sendSpeed(getCV(), spd, getDirection());
  }
  setPositionofControllers();
}

function setPositionofControllers() {
  // displayLog('setPositionofControllers()');
  spd = getSpeed();

  // Circular
  $("#circular-throttle").roundSlider("setValue", spd);

  // Vertical
  $("#v-throttle").val(spd).change();
  $("#v-throttle").slider("option", "value", spd);
  $("#speed-indicator").html(spd);

  // Knob
  $("#knob-value").html(spd);
  knob.val(spd).change();
}

function sendSpeed(locoId, speed, dir) {
  // displayLog('sendSpeed() locoId: ' + locoId);
  if (locoId <= 0) return;

  if ((locoId != lastLocoSent) || (speed != lastSpeedSent) || (dir != lastDirSent)) {
    setSpeed(speed);
    setDirection(dir);
    writeToStream("t " + locoId + " " + speed + " " + dir);
    lastLocoSent = locoId;
    lastSpeedSent = speed;
    lastDirSent = dir;
    lastTimeSent = new Date();
  }
  // displayLog('sendSpeed() ' + lastTimeSent);
}

function setPositionOfDirectionSlider(dir) { //1=forward -1=reverse 0=stop
  $(".dir-toggle").removeClass("forward backward  stop");
  switch (dir) {
    case (DIRECTION_FORWARD): {
      // displayLog('[EXTERNAL] Forward:' + dir);
      $(".dir-toggle").addClass("forward");
      break;
    }
    case (DIRECTION_REVERSED): {
      // displayLog('[EXTERNAL] backward:' + dir);
      $(".dir-toggle").addClass("backward");
      break;
    }
    // case (0): {
    //   $(".dir-toggle").addClass("stop");
    //   break;
    // }
  }
}

// This function will generate commands for each type of function
function generateFnCommand(clickedBtn) {

  func = clickedBtn.attr('name'); // Gives function name (F1, F2, .... F31)
  fn = parseInt(func.substring(1));
  eventType = clickedBtn.data("type"); // Gives type of button (Press/Hold or Toggle)
  btnPressed = clickedBtn.attr("aria-pressed");
  console.log("Function Name=>" + func + " , Button Type=>" + eventType + " , Button Pressed=>" + btnPressed);

  sendCommandForFunction(fn, ((btnPressed == "true") ? 1 : 0));
}

$(document).ready(function () {
  var mode = 0;
  // Left Menu
  $("#nav-open").on("click", function () {
    $("#side-menu").show().animate({ left: 0 });
  });
  $("#nav-close").on("click", function () {
    $("#side-menu").animate({ left: -260 }, function () {
      $("#side-menu").hide();
    });
  });



  $("#info-tooltip").tooltip({
    content:
      "<p>DCC-EX EX-WebThrottle<br>(WebThrottle-EX)</p><hr><p>Version: " + version + "</p><p><b>Credits</b><br> Fred Decker <br> Mani Kumar <br> Matt H <BR> Peter Akers</p>",
    show: {
      effect: "slideDown",
      delay: 100,
    },
    classes: {
      "ui-tooltip": "credits-tooltip",
    },
    position: {
      my: "left top",
      at: "left bottom",
    },
  });

  // Load function map, buttons throttle etc
  setThrottleScreenUI();
  $("#throttle-selector").on("change", function (e) {
    selectedval = $(this).val();
    console.log(selectedval);
    setPreference("scontroller", selectedval);
    setspeedControllerType(selectedval);
  });

  $("#theme-selector").on("change", function (e) {
    selectedval = $(this).val();
    console.log(selectedval);
    setPreference("theme", selectedval);
    $("link[title*='theme']").remove();
    if (selectedval != "simple") {
      $("head").append(
        '<link rel="stylesheet" type="text/css" title="theme" href="css/themes/' +
        selectedval +
        '.css">'
      );
    }
  });

  $("#timestamp-selector").on("change", function (e) {
    selectedval = $(this).val();
    setPreference("timestamp", selectedval);
  });


  // Connect command station
  $("#button-connect").on("click", function () {
    toggleServer($(this));
  });

  // Disconnect command station
  $("#button-disconnect").on("click", function () {
    disconnectServer();
  });

  // Aquire loco of given CV
  $("#button-getloco").on("click", function () {
    acButton = $(this);
    isAcquired = $(this).data("acquired");
    // Parse int only returns number if the string is starting with Number
    locoid_input = 0;
    if ($("#ex-locoid").val().length > 0) locoid_input = parseInt($("#ex-locoid").val());

    if (locoid_input != 0) {
      if (isAcquired == false && getCV() == 0) {
        setCV(locoid_input);
        $("#loco-info").html("Acquired Locomotive: " + locoid_input);
        console.log("Acquired Locomotive: " + locoid_input);
        displayLog("[i] Acquired Locomotive: " + locoid_input);
        acButton.data("acquired", true);
        acButton.html('<span class="icon-cross"></span>');
        toggleThrottleState(!isDirectionToggleStopped);
        writeToStream('t ' + locoid_input); // request an update for the loco
        // $("#select-map").focus();
        $("#power-switch").focus();

      } else {
        currentCV = getCV();
        $("#ex-locoid").val("");
        setCV(0);
        $("#loco-info").html("Released Locomotive: " + currentCV);
        console.log("Released Locomotive: " + currentCV);
        displayLog("[i] Released Locomotive: " + currentCV);
        acButton.data("acquired", false);
        acButton.html('<span class="icon-circle-right"></span>');
        toggleThrottleState(false);
        $("#select-map").val("default").trigger("change");
      }
    }
  });

  // read DCC address on PROG track
  $("#button-cv-read-loco-id").on("click", function () {
    writeToStream('R');
  });

  // write DCC address on PROG track
  $("#button-cv-write-loco-id").on("click", function () {
    cv_locoid_input = 0;
    if ($("#cv-locoid").val().length > 0) cv_locoid_input = parseInt($("#cv-locoid").val());

    if (cv_locoid_input != 0) {
      writeToStream('W ' + cv_locoid_input);
    }
  });

  // read cv address on PROG track
  $("#button-cv-read-cv").on("click", function () {
    cv_cvid_input = 0;
    if ($("#cv-cvid").val().length > 0) cv_cvid_input = parseInt($("#cv-cvid").val());

    if (cv_cvid_input != 0) {
      writeToStream('R ' + cv_cvid_input);
    }
  });

  // write DCC address on PROG track
  $("#button-cv-write-cv").on("click", function () {
    cv_cvid_input = 0;
    if ($("#cv-cvid").val().length > 0) cv_cvid_input = parseInt($("#cv-cvid").val());
    cv_cvvalue_input = -1;
    if ($("#cv-cvvalue").val().length > 0) cv_cvvalue_input = parseInt($("#cv-cvvalue").val());

    if ((cv_cvid_input != 0) && (cv_cvvalue_input >= 0)) {
      writeToStream('W ' + cv_cvid_input + " " + cv_cvvalue_input);
    }
  });

  $("#common-cvs").on("change", function (e) {
    selectedVal = $(this).val();
    if (selectedVal > 0) {
      $("#cv-cvid").val(selectedVal);
      $("#common-cvs").val("0");
      // $("#common-cvs[value=0]").prop('selected', true); 
      // $("#common-cvs[value=0]").attr('selected', true); 
    }
  });

  // Switch ON/OFF power of the Command station
  $("#power-switch").on("click", function () {
    pb = $(this).is(":checked");

    if (pb == true) {
      writeToStream("1");
      $("#power-status").html("is On");
    } else {
      writeToStream("0");
      $("#power-status").html("is Off");
    }
  });
  ////////////////////////////////////
  $("#v-throttle").slider({
    orientation: "vertical",
    min: 0,
    max: 126,
    disabled: true,
    range: "max",
    slide: function (event, ui) {
      $("#speed-indicator").html(ui.value);
      setSpeed(ui.value);
      setSpeedofControllers();
    },
  });

  /////////////////////////////////////////*/
  knob = $(".rotarySwitch").rotaryswitch({
    minimum: 0,
    maximum: 126,
    step: 2,
    beginDeg: 210,
    lengthDeg: 295,
    minimumOverMaximum: true,
    showMarks: true,
    themeClass: "big light",
  });
  toggleKnobState($("#knobthrottle"), false);
  knob.on("change", function () {
    oldValue = getSpeed();
    kval = knob.val();
    $("#knob-value").html(kval);
    setSpeed(kval);
    // Below condition is to avoid infinite loop
    // that triggers change() event indifinitely
    if (oldValue != kval) {
      if ((lastLocoReceived != getCV()) || (lastSpeedReceived != getSpeed()) || (lastDirReceived != getDirection())) {
        setSpeedofControllers();
      } else {
        setPositionofControllers();
      }
    } else {
      // if ( (lastLocoReceived!=getCV()) || (lastSpeedReceived!=getSpeed()) || (lastDirReceived!=getDirection()) ) {
      sendSpeed(getCV(), getSpeed(), getDirection());
      // }
    }
  });

  /////////////////////////////////////////////
  // Speed (round) Slider allows user to change the speed of the locomotive
  Tht = $("#circular-throttle").roundSlider({
    width: 20,
    radius: 116,
    value: speed,
    circleShape: "pie",
    handleShape: "dot",
    startAngle: 315,
    lineCap: "round",
    sliderType: "min-range",
    showTooltip: true,
    editableTooltip: false,
    handleSize: "+18",
    max: "126",
    disabled: true,
    update: function (slider) {
      setSpeed(slider.value);
      setSpeedofControllers();
    },
    valueChange: function (slider) {
      //setSpeed(slider.value);
      // console.log("This event is similar to 'update' event, in addition it will trigger even the value was changed through programmatically also.");
    },
  });

  // Allows user to change the direction of the loco and STOP.
  $(".dir-btn").on("click", function () {
    if (getCV() != 0) {
      current = $(this);
      lastDir = getDirection();
      dir = current.attr("data-direction");
      $(".dir-btn").removeClass("selected");
      current.addClass("selected", 200);
      console.log(dir);
      $(".dir-toggle").removeClass("forward backward  stop");
      $(".dir-toggle").addClass(dir);
      // Do direction stuff here
      switch (dir) {
        case "forward": {
          isStopped = false;
          isDirectionToggleStopped = false;
          setDirection(DIRECTION_FORWARD);
          setSpeedofControllers();
          sendSpeed(getCV(), getSpeed(), 1);
          break;
        }
        case "backward": {
          isStopped = false;
          isDirectionToggleStopped = false;
          setDirection(DIRECTION_REVERSED);
          setSpeedofControllers();
          sendSpeed(getCV(), getSpeed(), 0);
          break;
        }
        case "stop": {
          isStopped = true;
          isDirectionToggleStopped = true;
          setDirection(lastDir);
          setSpeed(DIRECTION_FORWARD);
          setSpeedofControllers();
          sendSpeed(getCV(), 0, lastDir);
          break;
        }
      }
      toggleThrottleState(!isDirectionToggleStopped);
    } else {
      console.log("No loco acquired");
    }
  });

  $("#emergency-stop").on("click", function () {
    if (getCV() != 0) {
      isStopped = true;
      dir = getDirection();
      setSpeed(0);
      setSpeedofControllers();
      sendSpeed(getCV(), -1, dir);
      writeToStream("!");
    }
    else {
      console.log("No loco acquired, but sending eStop anyway");
      writeToStream("!");
    }
  });

  $("#normal-stop").on("click", function () {
    if (getCV() != 0) {
      isStopped = true;
      dir = getDirection();
      setSpeed(0);
      setSpeedofControllers();
      sendSpeed(getCV(), 0, lastDir);
    }
  });

  // Hide/Show the Loco, Connect server fields (on top)
  $("#button-hide").on("click", function () {
    if ($(".details-panel").is(":visible")) {
      $(".details-panel").hide();
      $(this).css("top", 0);
      $(this).html('<span class="icon-circle-down"></span>');
      $("#log-box").height("190px");
    } else {
      $(".details-panel").show();
      $(this).html('<span class="icon-circle-up"></span>');
      $(this).css("top", "-9px");
      $("#log-box").height("120px");
    }
  });

  // PLUS button. Increases speed on Hold / Tap
  var tId = 0;
  $("#button-right")
    .on("mousedown", function () {
      event.stopImmediatePropagation();
      tId = setInterval(function () {
        var sp = getSpeed();
        if (sp <= 125 && getDirection() != -1 && getCV() != 0) {
          setSpeed(sp + speedStep);
          setSpeedofControllers();
          sendSpeed(getCV(), getSpeed(), getDirection());
          sp = 0;
        }
      }, 100);
    })
    .on("mouseup mouseleave", function () {
      clearInterval(tId);
    })
    .on("click", function () {
      event.stopImmediatePropagation();
      var sp = getSpeed();
      if (sp <= 125 && getDirection() != -1 && getCV() != 0) {
        setSpeed(sp + speedStep);
        setSpeedofControllers();
        sendSpeed(getCV(), getSpeed(), getDirection());
        sp = 0;
      }
    });

  // MINUS button. Decreases speed on Hold / Tap
  var tId = 0;
  $("#button-left")
    .on("mousedown", function () {
      event.stopImmediatePropagation();
      tId = setInterval(function () {
        var sp = getSpeed(sp);
        if (sp >= 1 && getDirection() != -1 && getCV() != 0) {
          setSpeed(sp - speedStep);
          setSpeedofControllers();
          sendSpeed(getCV(), getSpeed(), getDirection());
          sp = 0;
        }
      }, 100);
    })
    .on("mouseup mouseleave", function () {
      clearInterval(tId);
    })
    .on("click", function () {
      event.stopImmediatePropagation();
      var sp = getSpeed(sp);
      if (sp >= 1 && getDirection() != -1 && getCV() != 0) {
        setSpeed(sp - speedStep);
        setSpeedofControllers();
        sendSpeed(getCV(), getSpeed(), getDirection());
        sp = 0;
      }
    });

  // Functions buttons
  // Send Instructions to generate command depends the type of Button (press/toggle)
  var timer = 0;
  $(document)
    .on("mousedown", ".fn-btn", function () {
      console.log($(this).val);
      clickedBtn = $(this);
      btnType = clickedBtn.data("type");
      if (btnType == "press") {
        timer = setInterval(function () {
          // MOMENTARY HOLD ON
          clickedBtn.attr("aria-pressed", "true");
          generateFnCommand(clickedBtn);
          console.log("PRESSED HOLD ==> " + clickedBtn.attr("name"));
        }, 100);
      }
    })

    .on("mouseup mouserelease", ".fn-btn", function () {
      clearInterval(timer);
      clickedBtn = $(this);
      btnType = clickedBtn.data("type");
      btnState = clickedBtn.attr("aria-pressed");
      if (btnType == "press") {
        // MOMENTARY HOLD OFF
        clickedBtn.attr("aria-pressed", "false");
        generateFnCommand(clickedBtn);
        console.log("RELEASED HOLD  ==> " + clickedBtn.attr("name"));
      } else {
        if (btnState == "false") {
          // TOGGLE ON
          clickedBtn.attr("aria-pressed", "true");
          generateFnCommand(clickedBtn);
          console.log("TOGGLE ON ==> " + clickedBtn.attr("name"));
        } else {
          // TOGGLE OFF
          clickedBtn.attr("aria-pressed", "false");
          generateFnCommand(clickedBtn);
          console.log("TOGGLE OFF ==> " + clickedBtn.attr("name"));
        }
      }
    });

  // Hide/Show the Debug console
  $("#console-toggle").on("click", function () {
    pb = $(this).is(":checked");
    if (pb == true) {
      $("#debug-console").show();
      setPreference("dbugConsole", true);
    } else {
      $("#debug-console").hide();
      setPreference("dbugConsole", false);
    }
  });

  // Send command written in console
  $("#button-sendCmd").on("click", function () {
    cmd = $("#cmd-direct").val();
    writeToStream(cmd);
    document.getElementById("cmd-direct").value = "";
  });

  // Clear the console log window
  $("#button-clearLog").on("click", function () {
    $("#log-box").html("");
    $("#log-box2").html("");
  });

  // Clear the console log window
  $("#button-copyLog").on("click", function () {
    copyLogToClipboard();
  });

  // Send command written in console
  $("#button-sendCmd2").on("click", function () {
    cmd = $("#cmd-direct2").val();
    writeToStream(cmd);
    document.getElementById("cmd-direct2").value = "";
  });

  // Clear the console log window
  $("#button-clearLog2").on("click", function () {
    $("#log-box").html("");
    $("#log-box2").html("");
  });

  // Clear the console log window
  $("#button-copyLog2").on("click", function () {
    copyLogToClipboard();
  });

  // Function to toggle fullScreen viceversa
  $("#fs-toggle").on("click", function () {
    st = $(this).attr("state");
    var elem = document.documentElement;
    if (st == "ws") {
      $(this).attr("state", "fs");

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    } else {
      $(this).attr("state", "ws");
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    }
  });

  //Handles navigation clicks
  $("#throttle-nav").on("click", function () {
    hideWindows();
    $("#throttle-window").show();
    showNavigationButtons("throttle");
    $("#nav-close").trigger("click");
  });
  $("#cv-programmer-nav").on("click", function () {
    hideWindows();
    $("#cv-programmer-window").show();
    showNavigationButtons("cv-programmer");
    $("#nav-close").trigger("click");
  });
  $("#routes-nav").on("click", function () {
    hideWindows();
    $("#routes-window").show();
    showNavigationButtons("routes");
    loadRoutes();
    $("#nav-close").trigger("click");
  });
  $("#turnouts-nav").on("click", function () {
    hideWindows();
    $("#turnouts-window").show();
    showNavigationButtons("turnouts");
    loadTurnouts();
    $("#nav-close").trigger("click");
  });
  $("#loco-nav").on("click", function () {
    hideWindows();
    $("#loco-window").show();
    showNavigationButtons("locos");
    $("#nav-close").trigger("click");
    loadLocomotives();
  });
  $("#fn-map-nav").on("click", function () {
    hideWindows();
    $("#fn-map-window").show();
    showNavigationButtons("function-maps");
    $("#nav-close").trigger("click");
    setFunctionMaps();
    //loadMapData("Default");
  });
  $("#settings-nav").on("click", function () {
    hideWindows();
    $("#settings-window").show();
    showNavigationButtons("");
    $("#nav-close").trigger("click");
  });

  // new navigation buttons
  $("#throttle-screen-button").on("click", function () {
    hideWindows();
    $("#throttle-window").show();
    showNavigationButtons("throttle");
  });
  $("#cv-programmer-screen-button").on("click", function () {
    hideWindows();
    $("#cv-programmer-window").show();
    showNavigationButtons("cv-programmer");
  });
  $("#routes-screen-button").on("click", function () {
    hideWindows();
    $("#routes-window").show();
    showNavigationButtons("routes");
    loadRoutes();
  });
  $("#turnouts-screen-button").on("click", function () {
    hideWindows();
    $("#turnouts-window").show();
    showNavigationButtons("turnouts");
    loadTurnouts();
  });
  $("#locos-screen-button").on("click", function () {
    hideWindows();
    $("#loco-window").show();
    loadLocomotives();
    showNavigationButtons("locos");
  });
  $("#function-maps-screen-button").on("click", function () {
    hideWindows();
    $("#fn-map-window").show();
    setFunctionMaps();
    //loadMapData("Default");
    showNavigationButtons("function-maps");
  });
  $("#settings-button").on("click", function () {
    hideWindows();
    $("#settings-window").show();
    showNavigationButtons("");
  });

  eventListeners();

  /*
    $("#settings-general").on('click', function(){
        hideSettings();
        $("#general-section").show();
    });

    $("#settings-storage").on('click', function(){
        hideSettings();
        $("#storage-section").show();
    });*/

  $("#settings-general").on("click", function () {
    /*var target = $('#general-section');
        if (target.length) {
            $('#settings-panel').animate({
                scrollTop: target.offset().top
            }, 1000);

        }*/
    $("#general-section")[0].scrollIntoView(true);
  });

  $("#settings-storage").on("click", function () {
    /*var target = $('#storage-section');
        if (target.length) {
            $('#settings-panel').animate({
                scrollTop: target.offset().top
            }, 1000);

        }*/
    $("#storage-section")[0].scrollIntoView(true);
  });

  $('#settings-app').on('click', function () {
    $("#app-section")[0].scrollIntoView(true);
  })

  $(document).on("click", ".map-name", function () {
    const ename = $(this).attr("map-val");
    const name = unescape(ename);
    loadMapData(name);
    $("li.map-name").removeClass("active");
    $(this).addClass("active");
  });

  // This allows user to delete currently selected Map
  $(document).on("click", "#delete-map", function () {
    selectedval = $("#cur-map-val").attr("cur-map");
    if (selectedval != "Default") {
      deleteFuncData(selectedval);
      // loadmaps();
      loadCombinedMaps();
      setFunctionMaps();
      loadMapData("Default");
      $("#select-map").val("default").trigger("change");
      $("li.map-name").removeClass("active");
      $("li.map-name[map-val= 'Default']").addClass("active");
    }
  });

  $(document).on("click", ".edit-cur-loco", function () {
    cabdata = getStoredLocoData($(this).attr("data-loco"));
    $("#loco-form")[0].reset();
    $("#loco-form-content").css("display", "inline-block");
    $(".add-loco-form .add-loco-head").html("Edit Locomotive");
    $("#loco-submit").attr("loco-mode", "edit");
    $("#loco-submit").attr("loco-id", $(this).attr("loco-id"));
    $.each(cabdata, function (key, value) {
      $("#loco-form").children().find("#" + key).val(value);
      if (key == "map") {
        $("#function-maps").autocomplete("search", value);
        var menu = $("#function-maps").autocomplete("widget");
        $(menu[0].children[0]).click();
      }
    });
  });

});

$(document).on("click", ".run-cur-route", function () {
  // routesdata = getStoredRouteData($(this).attr("route-id"));
  // writeToStream("/ START "+ $(this).attr("route-id"));
  try {
    for (i=0;i<routesCount;i++) {
      if (routesIds[i] == $(this).attr("route-id")) {
        if ((getCV() == 0) || (routesTypes[i] == "R")) {
            // No loco set *or* ROUTE...
            writeToStream("/ START "+ $(this).attr("route-id"));
         } else {
            // AUTOMATION with loco set...
            writeToStream("/ START "+ getCV() + " " + $(this).attr("route-id"));
          }
        break; 
        }
      } 
  } catch (e) {
    console.log(getTimeStamp() + ' [ERROR] Unable to process route/automation');
  }
});

$(document).on("click", ".throw-cur-turnout", function () {
  writeToStream("T " + $(this).attr("turnout-id") + " 1");
});

$(document).on("click", ".close-cur-turnout", function () {
  writeToStream("T " + $(this).attr("turnout-id") + " 0");
});

function setFunctionMaps() {
  const defaultMap = {
    mname: "Default",
    fnData: {},
  }
  const maps = [defaultMap, ...getMapData()];

  $("#function-mappings").empty();
  maps.forEach(map => {
    const name = map.mname
    const ename = escape(name);
    $("#function-mappings").append(`<li class='map-name' map-val=${ename}>${name}</li>`);
  })
}

function hideWindows() {
  $("#throttle-window").hide();
  $("#cv-programmer-window").hide();
  $("#routes-window").hide();
  $("#turnouts-window").hide();
  $("#loco-window").hide();
  $("#fn-map-window").hide();
  $("#settings-window").hide();
}
function showNavigationButtons(which) {
  $("#throttle-screen-button").show();
  $("#cv-programmer-screen-button").show();
  $("#routes-screen-button").show();
  $("#turnouts-screen-button").show();
  $("#locos-screen-button").show();
  $("#function-maps-screen-button").show();
  if(which.length>0) {
    $("#"+which+"-screen-button").hide()
  }
}

function hideSettings() {
  $("#general-section").hide();
  $("#storage-section").hide();
}

function credits() {
  authors = ["Fred Decker", "Mani Kumar", "Matt", "Peter Akers"]
  displayLog("Credits:")
  console.log("Credits:")
  for (i = 0; i < authors.length; i++) {
    displayLog(authors[i])
    console.log(authors[i])
  }
}


function eventListeners() {
  var cmdDirect = document.getElementById("cmd-direct");
  var cmdDirect2 = document.getElementById("cmd-direct2");
  var exLocoID = document.getElementById("ex-locoid");
  cmdDirect.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      // Trigger the button element with a click
      $('#button-sendCmd').click();
    }
  });
  cmdDirect2.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      // Trigger the button element with a click
      $('#button-sendCmd2').click();
    }
  });
  exLocoID.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      // Trigger the button element with a click
      $('#button-getloco').click();
    }
  })
}
