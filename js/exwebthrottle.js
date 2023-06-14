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
			 
    This is part of the DCC++ EX Project for model railroading and more.
	For more information, see us at dcc-ex.com.
*/
window.cv=0;
window.speed=0;
window.direction=1;
window.server="";
window.port=4444;
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
    "f28": 0
};
window.isStopped = true;
let port;
let emulatorMode;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

let pressed = false;


// Enables and disables ui elements

function uiDisable (status) {
    /*document.getElementById('ex-locoid').disabled = status
    document.getElementById('power-switch').disabled = status
    document.getElementById('button-sendCmd').disabled = status
    document.getElementById('dir-f').disabled = status
    document.getElementById('dir-S').disabled = status*/
    //document.getElementById('dir-b').disabled = status
    $("#ex-locoid").prop('disabled', status)
    $("#power-switch").prop('disabled', status)
    $("#button-sendCmd").prop('disabled', status)
    $("#dir-f").prop('disabled', status)
    $("#dir-S").prop('disabled', status)
    $("#dir-b").prop('disabled', status)
    if (status){
        //$("#throttle").roundSlider("disable");
        //toggleThrottleState(false)
        $("#button-getloco").trigger("click");
    } else {
        //$("#throttle").roundSlider("enable");
        //toggleThrottleState(true)
        //$("#button-getloco").trigger("click");
    }
}

// Returns given function current value (0-disable/1-enable)
function getFunCurrentVal(fun){
    return window.functions[fun];
}
// Set given function current value with given value (0/1)
function setFunCurrentVal(fun, val){
    window.functions[fun]=val;
}
// Set given CV value
function setCV(val){
    window.cv = val;
    console.log("Set Cab Address: "+val);
}
// Get stored CV value
function getCV(){
    return window.cv
}

// Set Speed value
function setSpeed(sp){
    window.speed=sp;
}

// Get Speed value
function getSpeed(){
    return parseInt(window.speed);
}

// Set Direction 
function setDirection(dir){
    window.direction=dir;
}

// Get Direction value
function getDirection(dir){
    return window.direction;
}

// Handling Disabling functionality for Knob Type throttle (it will not Out of the box) 
function toggleKnobState(ele, state) {
    if(!state){
        ele.addClass("disabled");
    }else{
        ele.removeClass("disabled");
    }
}
function loadMapData(map){
    data = [];
    if (map == "Default") {
      data = { mname: "Default", fnData: fnMasterData };
    } else {
      data = getStoredMapData(map);
    }
    $("#mapping-panel").empty();
    $("#mapping-panel").append(
      '<div class="settings-subheading row">' +
        '<div class="column-7 pl0"><div class="map-name-heading">' +
        map +
        "</div></div>" +
        '<div class="column-3 pr0">' +
        '<input type="hidden" id="cur-map-val" cur-map="'+map+'"/>' +
        '<a href="#" class="option-btn waste-bin" id="delete-map"> &#128465;</a>' +
        '<a href="#" class="option-btn" id="import-map"> &#8595;</a>' +
        '<a href="#" class="option-btn" id="export-cur-map"> &#8593;</a>' +
        '<a href="#" class="option-btn" id="edit-cur-map">&#9998;</a>' +
        "</div>" +
        "</div>"
    );
    $("#mapping-panel").append(
        '<div class="row settings-group fnhead">' +
          '<div class="column-2">Function</div>'+
          '<div class="column-4">Name</div>'+
          '<div class="column-2">Type</div>' +
          '<div class="column-2">Visible</div>' +
        '</div>'
    );
    container = $('<div class="maps-content"></div>').appendTo("#mapping-panel");
    $.each(data.fnData, function (key, value) {
      container.append(
        '<div class="row settings-group" id="'+key+'">' +
          '<div class="column-2 caplitalize">'+key+'</div>'+
          '<div class="column-4">'+value[2]+'</div>'+
          '<div class="column-2">'+ (value[1] == 1 ? '<span class="pill red">Momentary</span>' : '<span class="pill green">Latching</span>') +'</div>' +
          '<div class="column-2">'+ (value[3] == 1 ? '<span class="pill green">Visible</span>' : '<span class="pill">Hidden</span>') +'</div>' +
        '</div>'
      );
    });

}
function loadLocomotives(){
    locos = getLocoList();
    $("#locomotives-panel").empty();
    $.each(locos, function (key, value) {
      $("#locomotives-panel").append(
        '<div class="row settings-group" id="'+key+'">'+
          '<div class="column-1 sno"><p>' + (key + 1) + "</p></div>" +
          '<div class="column-7 loco-details">' +
          '<div class="row">' +
          '<div class="column-7"><p class="ac-loco-name column-10">' +
          value.name +
          "</p></div>" +
          '<div class="column-2 cv-num"><p><small>CV </small>' +
          value.cv +
          "</p></div>" +
          "</div>" +
          '<div class="row sub-text">' +
          '<div class="column-3"><p>' + value.type + '</p></div>' +
          '<div class="column-3">' +
          (value.decoder == "" ? '<p class="nd">Undefined</p>' : "<p>" + value.decoder + "</p>") +
          "</div>" +
          '<div class="column-3">' +
          (value.brand == "" ? '<p class="nd">Undefined</p>' : "<p>" + value.brand + "</p>") +
          "</div></div></div>" +
          '<div class="column-2 asst-map"><div class="row">' +
          '<div class="column-7"><p class="muted">Map</p><p>' +
          value.map +
          "</p></div>" +
          '<div class="column-3 prh"><a href="#" loco-id="'+key+'" data-loco="'+
          value.name+'" class="edit-cur-loco"> &#9998; </a></div></div>' +
          "</div></br>"
      );      
    });
}
//Initialization routine for Throttle screen
function setThrottleScreenUI() {
    loadmaps();
    loadButtons({ mname: "default", fnData: fnMasterData });
    controller = getPreference("scontroller");
    $("#throttle-selector").val(controller).trigger("change");
    setspeedControllerType(controller);

    // Show and hide debug console based on preference set in earlier session
    if (getPreference("dbugConsole") == null) {
        setPreference("dbugConsole", true);
    }
    if(getPreference("dbugConsole")) {
        $("#debug-console").show() 
        $("#console-toggle").prop("checked", true);
    }else{
        $("#debug-console").hide();
        $("#console-toggle").prop("checked", false);
    }

    $(".dir-toggle").addClass("forward");

    // Set theme
    if (getPreference("theme") == null) {
        setPreference("theme", "simple");
    }else{
        theme = getPreference("theme");
        $("#theme-selector").val(theme).trigger("change");
        if (theme != "simple") {
            $("link[title*='theme']").remove();
            $("head").append(
                '<link rel="stylesheet" type="text/css" title="theme" href="css/themes/'+theme+'.css">'
            );
        }
    }
}

// Change the Speed controller type
function setspeedControllerType(pref){
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
function toggleThrottleState(state){
    if(state){
        $("#circular-throttle").roundSlider("enable");
        $("#v-throttle").slider("enable");
        toggleKnobState($("#knobthrottle"), true);
    }else{
        $("#circular-throttle").roundSlider("disable");
        $("#v-throttle").slider("disable");
        toggleKnobState($("#knobthrottle"), false);
    }
}

/********************************************************** 
 * This function will
    1. Send Speed command
    2. Set speed value of all the available sliders/controllers
    3. Set respctive speed number 
************************************************************/
function setSpeedofControllers(){
    spd = getSpeed();
    
    if(!isStopped){
        writeToStream("t 01 " + getCV() + " " + spd + " " + getDirection());
    }
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

// This function will generate commands for each type of function
function generateFnCommand(clickedBtn){
    
       func = clickedBtn.attr('name'); // Gives function name (F1, F2, .... F28)
       eventType = clickedBtn.data("type"); // Gives type of button (Press/Hold or Toggle)
       btnPressed = clickedBtn.attr("aria-pressed");
       //console.log("Function Name=>"+func+" , Button Type=>"+eventType+" , Button Pressed=>"+btnStatus);
    
       switch(func){
            case "f0":
            case "f1":
            case "f2":
            case "f3":
            case "f4":
            { 
                if(btnPressed=="true"){ 
                    sendCommandForF0ToF4(func,1);                
                }else{ 
                    sendCommandForF0ToF4(func,0);
                }
                break;
            }
            case "f5":
            case "f6":
            case "f7":
            case "f8":
            { 
                if(btnPressed=="true"){ 
                    sendCommandForF5ToF8(func,1);                
                }else{ 
                    sendCommandForF5ToF8(func,0);
                }
                break;
            }
            case "f9":
            case "f10":
            case "f11":
            case "f12":
            { 
                if(btnPressed=="true"){ 
                    sendCommandForF9ToF12(func,1);                
                }else{ 
                    sendCommandForF9ToF12(func,0);
                }
                break;
            }
            case "f13":
            case "f14":
            case "f15":
            case "f16":
            case "f17":
            case "f18":
            case "f19":
            case "f20":
                { 
                    if(btnPressed=="true"){ 
                        sendCommandForF13ToF20(func,1);                
                    }else{     
                        sendCommandForF13ToF20(func,0);
                    }
                    break;
            }
            case "f21":
            case "f22":
            case "f23":
            case "f24":
            case "f25":
            case "f26":
            case "f27":
            case "f28":
                { 
                    if(btnPressed=="true"){ 
                        sendCommandForF21ToF28(func,1);                
                    }else{  
                        sendCommandForF21ToF28(func,0);
                    }
                    break;
            }
            default:
            {
                alert("Invalid Function");
            }

       }          
}

$(document).ready(function(){
    var mode = 0;
    // Left Menu
    $("#nav-open").on("click", function () { 
        $("#side-menu").show().animate({ left: 0 });
    });
    $("#nav-close").on("click", function () {
        $("#side-menu").animate({ left: -260 }, function(){
            $("#side-menu").hide();
        });
    });

    

  $("#info-tooltip").tooltip({
    content:
      "<p>DCC++ EX Web Throttle<br>(WebThrottle-EX)</p><hr><p>Version: "+version+"</p><p><b>Credits</b><br> Fred Decker <br> Mani Kumar <br> Matt H</p>",
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
    locoid_input = parseInt($("#ex-locoid").val());

    if (locoid_input != 0) {
      if (isAcquired == false && getCV() == 0) {
        setCV(locoid_input);
        $("#loco-info").html("Acquired Locomotive: " + locoid_input);
        acButton.data("acquired", true);
        acButton.html('<span class="icon-cross"></span>');
        toggleThrottleState(true);
      } else {
        currentCV = getCV();
        $("#ex-locoid").val(0);
        setCV(0);
        $("#loco-info").html("Released Locomotive: " + currentCV);
        acButton.data("acquired", false);
        acButton.html('<span class="icon-circle-right"></span>');
        toggleThrottleState(false);
      }
    }
  });

  // Switch ON/OFF power of the Command station
  $("#power-switch").on("click", function () {
    pb = $(this).is(":checked");

    if (pb == true) {
      writeToStream("1");
      $("#power-status").html("On");
    } else {
      writeToStream("0");
      $("#power-status").html("Off");
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
      setSpeedofControllers();
    } else {
      writeToStream(
        "t 01 " + getCV() + " " + getSpeed() + " " + getDirection()
      );
    }
    //console.log( "t 01 " + getCV() + " " + getSpeed() + " " + getDirection());
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
      //console.log("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
    },
    valueChange: function (slider) {
      //setSpeed(slider.value);
      //writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
      // console.log("This event is similar to 'update' event, in addition it will trigger even the value was changed through programmatically also.");
    },
  });

  // Allows user to change the direction of the loco and STOP.
  $(".dir-btn").on("click", function () {
    if (getCV() != 0){
      current = $(this);
      dir = current.attr("aria-label");
      $(".dir-btn").removeClass("selected");
      current.addClass("selected", 200);
      console.log(dir);
      $(".dir-toggle").removeClass("forward backward  stop");
      $(".dir-toggle").addClass(dir);
      // Do direction stuff here
      switch (dir) {
        case "forward": {
          isStopped = false;
          setDirection(1);
          setSpeedofControllers();
          writeToStream("t 01 " + getCV() + " " + getSpeed() + " 1");
          break;
        }
        case "backward": {
          isStopped = false;
          setDirection(0);
          setSpeedofControllers();
          writeToStream("t 01 " + getCV() + " " + getSpeed() + " 0");
          break;
        }
        case "stop": {
          isStopped = true;
          dir = getDirection();
          setSpeed(0);
          setSpeedofControllers();
          writeToStream("t 01 " + getCV() + " 0 " + dir);
          break;
        }
      }
    }else{
      console.log("No loco acquired");
    }
  });

  $("#emergency-stop").on("click", function () {
      if (getCV() != 0){
        isStopped = true;
        dir = getDirection();
        setSpeed(0);
        setSpeedofControllers();
        writeToStream("t 01 " + getCV() + " -1 " + dir);
      }
      else{
        console.log("No loco acquired");
      }
  });

  // Hide/Show the Loco, Connect server fields (on top)
  $("#button-hide").on("click", function () {
    if ($(".details-panel").is(":visible")) {
      $(".details-panel").hide();
      $(this).css("top", 0);
      $(this).html('<span class="icon-circle-down"></span>');
    } else {
      $(".details-panel").show();
      $(this).html('<span class="icon-circle-up"></span>');
      $(this).css("top", "-9px");
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
          writeToStream(
            "t 01 " + getCV() + " " + getSpeed() + " " + getDirection()
          );
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
        writeToStream(
          "t 01 " + getCV() + " " + getSpeed() + " " + getDirection()
        );
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
          writeToStream(
            "t 01 " + getCV() + " " + getSpeed() + " " + getDirection()
          );
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
        writeToStream(
          "t 01 " + getCV() + " " + getSpeed() + " " + getDirection()
        );
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
    $("#nav-close").trigger("click");
  });
  $("#loco-nav").on("click", function () {
    hideWindows();
    $("#loco-window").show();
    $("#nav-close").trigger("click");
    loadLocomotives();
  });
  $("#fn-map-nav").on("click", function () {
    hideWindows();
    $("#fn-map-window").show();
    $("#nav-close").trigger("click");
    setFunctionMaps();
    //loadMapData("Default");
  });
  $("#settings-nav").on("click", function () {
    hideWindows();
    $("#settings-window").show();
    $("#nav-close").trigger("click");
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

  $('#settings-app').on('click', function() {
    $("#app-section")[0].scrollIntoView(true);
  })

  $(document).on("click", ".map-name", function () {
    loadMapData($(this).attr("map-val"));
    $("li.map-name").removeClass("active");
    $(this).addClass("active");
  });

  // This allows user to delete currently selected Map
  $(document).on("click", "#delete-map", function () {
    selectedval = $("#cur-map-val").attr("cur-map");
    if (selectedval != "Default") {
      deleteFuncData(selectedval);
      loadmaps();
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
      $("#loco-form").children().find("#"+key).val(value);
      if(key=="map"){
        $("#function-maps").autocomplete("search", value);
        var menu = $("#function-maps").autocomplete("widget");
        $(menu[0].children[0]).click();
      }
    });
  });

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
    $("#function-mappings").append(`<li class='map-name' map-val=${name}>${name}</li>`);
  })
}

function hideWindows(){
    $("#throttle-window").hide();
    $("#loco-window").hide();
    $("#fn-map-window").hide();
    $("#settings-window").hide();
}

function hideSettings(){
    $("#general-section").hide();
    $("#storage-section").hide();
}

function credits() {
    authors = ["Fred Decker","Mani Kumar","Matt"]
    displayLog("Credits:")
    console.log("Credits:")
    for (i=0; i<authors.length; i++) {
        displayLog(authors[i])
        console.log(authors[i])
    }
}


function eventListeners(){
    var cmdDirect = document.getElementById("cmd-direct");
    var exLocoID = document.getElementById("ex-locoid");  
    cmdDirect.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            // Trigger the button element with a click
            $('#button-sendCmd').click();
        }
    });
    exLocoID.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            // Trigger the button element with a click
            $('#button-getloco').click();
        }
    })
}
