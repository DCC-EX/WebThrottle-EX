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

let port;
let emulator;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

let pressed = false;

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
    console.log("SET LOCO ID :=> "+val);
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
    return window.speed;
}

// Set Direction 
function setDirection(dir){
    window.direction=dir;
}

// Get Direction value
function getDirection(dir){
    return window.direction;
}

function setThrottleScreenUI() {
  loadmaps();
  loadButtons({ mname: "default", fnData: fnMasterData });

  // Set saved throttle or use circular throttle as default

  if (getPreference("vThrottle") == null) {
    setPreference("vThrottle", false);
  }
  if (getPreference("vThrottle")) {
    $("#vertical-throttle").show();
    $("#throttle").hide();
    $("#throttle-type").attr("checked", "checked");
  } else {
    $("#vertical-throttle").hide();
    $("#throttle").show();
  }

  // Show and hide debug console based on prrference set in earlier session
  if (getPreference("dbugConsole") == null) {
    setPreference("dbugConsole", true);
  }
  getPreference("dbugConsole")
    ? $("#debug-console").show()
    : $("#debug-console").hide();
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

    // Load function map, buttons throttle etc
    setThrottleScreenUI()

    $("#v-throttle").slider({
      orientation: "vertical",
      min: 0,
      max: 126,
      disabled: true,
      range: "max",
      slide: function (event, ui) {
          $("#speed-indicator").html(ui.value);
            setSpeed(ui.value);
            writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
            console.log("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
            $("#throttle").roundSlider("setValue", ui.value);
      },
    });
    $("#throttle-type").on("click", function () {
        pb = $(this).is(":checked");   
        if (pb == true){
            $("#vertical-throttle").show();
            $("#throttle").hide();
            setPreference("vThrottle", true);
        } else {
            $("#vertical-throttle").hide();
            $("#throttle").show();
            setPreference("vThrottle", false);
        }
    });

    // Connect command station
    $("#button-connect").on('click',function(){
        toggleServer($(this));
    });

    // Disconnect command station
    $("#button-disconnect").on('click',function(){
        disconnectServer();
    });

     // Aquire loco of given CV
    $("#button-getloco").on('click',function(){
        acButton = $(this);
        isAcquired = $(this).data("acquired");
        locoid_input = $("#ex-locoid").val();
        if (locoid_input!=0){
            if(isAcquired == false && getCV()==0){ 
                
                setCV(locoid_input);
                $("#loco-info").html("Acquired Locomotive: "+locoid_input);
                acButton.data("acquired", true);
                acButton.html("Release");
                $("#throttle").roundSlider("enable");
                $("#v-throttle").slider("enable");

            }else{

                currentCV = getCV();                     
                $("#ex-locoid").val(0);

                setCV(0);
                $("#loco-info").html("Released Locomotive: "+currentCV);
                acButton.data("acquired", false);
                acButton.html("Acquire");
                $("#throttle").roundSlider("disable");
                $("#v-throttle").slider("disable");
                $("#v-throttle").slider("option", "value", 0);
            }
        }
    });   

    // Switch ON/OFF power of the Command station
    $("#power-switch").on('click',function(){
        pb = $(this).is(':checked');
        
        if (pb == true){
            writeToStream('1');
            $("#power-status").html('On');
        } else {
            writeToStream('0');
            $("#power-status").html('Off');
        }
    });

    // Speed (round) Slider allows user to change the speed of the locomotive
    Tht = $("#throttle").roundSlider({
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
        create: function(){
            //console.log("This will trigger just before creation of throttle slider UI");
        },
        start: function(){
            //console.log("This event trigger when the user starts to drag the handle.");
        },
        stop: function(){
            //console.log("This event trigger when the user stops from sliding the handle / when releasing the handle.");
        },
        beforeValueChange: function(){
            //console.log("This event will trigger before the value change happens.");
        },
        update: function(slider){  // can change this to "drage" and write the stream in "change:" instead
            setSpeed(slider.value);
            writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
            $("#v-throttle").slider("option", "value", slider.value);
            $("#speed-indicator").html(slider.value);
            console.log("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
           // console.log("This event is the combination of 'drag' and 'change' events.");
        },
        valueChange: function(slider){
            //setSpeed(slider.value);
            //writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
           // console.log("This event is similar to 'update' event, in addition it will trigger even the value was changed through programmatically also.");
        }
    });

    // Allows user to change the direction of the loco and STOP.
    $(".dir-btn").on('click', function(){
        current = $(this);
        dir = current.attr("aria-label");
        $(".dir-btn").removeClass("selected");
        current.addClass("selected", 200);

        console.log(dir);
        // Do direction stuff here
        switch(dir){
            case "forward":
            { 
                setDirection(1);
                $("#throttle").roundSlider("enable");
                $("#throttle").roundSlider("setValue", getSpeed());
                $("#v-throttle").slider("enable");
                $("#v-throttle").slider("option", "value", getSpeed());
                $("#speed-indicator").html(getSpeed());
                writeToStream("t 01 "+getCV()+" "+getSpeed()+" 1");
                break;
            }
            case "backward":
            { 
                setDirection(0);
                $("#throttle").roundSlider("enable");
                $("#throttle").roundSlider("setValue", getSpeed());
                $("#v-throttle").slider("enable");
                $("#v-throttle").slider("option", "value", getSpeed());
                $("#speed-indicator").html(getSpeed());
                writeToStream("t 01 "+getCV()+" "+getSpeed()+" 0");
                break;
            }
            case "stop":
            { 
                dir = getDirection();
                //setDirection(-1); //direction = -1;
                setSpeed(0);
                writeToStream("t 01 "+getCV()+" -1 "+dir);
                $("#throttle").roundSlider("disable");
                $("#throttle").roundSlider("setValue", 0);
                $("#v-throttle").slider("option", "value", 0);
                $("#speed-indicator").html(0);
                $("#v-throttle").slider("disable");
                break;
            }
        }

    });
    
    // Hide/Show the Loco, Connect server fields (on top)
    $("#button-hide").on('click',function(){
        if ($(".details-panel").is(":visible")){ 
            $(".details-panel").hide();
            $(this).html( 'Show <span class="arrow down"></span>');
        }else{
            $(".details-panel").show();
            $(this).html( 'Hide <span class="arrow up"></span>');
        }
       
    });

    // PLUS button. Increases speed on Hold / Tap 
    var tId = 0;
    $("#button-right").on('mousedown', function() { 
        event.stopImmediatePropagation();
        tId = setInterval(function(){
            var sp = getSpeed();
            if((sp <= 125) && (getDirection() != -1) && (getCV() != 0)){
                setSpeed(sp+speedStep);                       
                $("#throttle").roundSlider("setValue", getSpeed());
                 $("#v-throttle").slider("option", "value", getSpeed());
                 $("#speed-indicator").html(getSpeed());
                writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
                sp=0;
            }
        }, 100); 
    }).on('mouseup mouseleave', function() { 
        clearInterval(tId); 
    }).on('click',function(){
        event.stopImmediatePropagation();
        var sp = getSpeed();
        if((sp <= 125) && (getDirection() != -1) && (getCV() != 0)){
            setSpeed(sp+speedStep);
            $("#throttle").roundSlider("setValue", getSpeed());
            $("#v-throttle").slider("option", "value", getSpeed());
            $("#speed-indicator").html(getSpeed());
            writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
            sp=0;
        }
        
    });

    // MINUS button. Decreases speed on Hold / Tap 
    var tId = 0;
    $("#button-left").on('mousedown', function() { 
        event.stopImmediatePropagation();
        tId = setInterval(function(){
            var sp = getSpeed(sp);
            if((sp >= 1) && (getDirection() != -1) && (getCV() != 0)){
                setSpeed(sp-speedStep);
                $("#throttle").roundSlider("setValue", getSpeed());
                $("#v-throttle").slider("option", "value", getSpeed());
                $("#speed-indicator").html(getSpeed());
                writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
                sp=0;
            }
        }, 100); 
    }).on('mouseup mouseleave', function() { 
        clearInterval(tId); 
    }).on('click',function(){
        event.stopImmediatePropagation();
        var sp = getSpeed(sp);
        if((sp >= 1)&& (getDirection() != -1) && (getCV() != 0)){
            setSpeed(sp-speedStep);
            $("#throttle").roundSlider("setValue", getSpeed());
            $("#v-throttle").slider("option", "value", getSpeed());
            $("#speed-indicator").html(getSpeed());
            writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
            sp=0;
        }
    });
    

    // Functions buttons
    // Send Instructions to generate command depends the type of Button (press/toggle)
    var timer= 0;
    $(document).on('mousedown', '.fn-btn', function() {  
        console.log($(this).val);  
        clickedBtn = $(this);
        btnType = clickedBtn.data('type');
        if(btnType == "press"){
            timer = setInterval(function(){
                // MOMENTARY HOLD ON
                clickedBtn.attr("aria-pressed", 'true');
                generateFnCommand(clickedBtn);
                console.log("PRESSED HOLD ==> "+clickedBtn.attr('name'));
            }, 100);
        }
    }).on('mouseup mouserelease', '.fn-btn', function() {
        clearInterval(timer);
        clickedBtn = $(this);
        btnType = clickedBtn.data('type');
        btnState = clickedBtn.attr("aria-pressed")
        if(btnType == "press"){     
            // MOMENTARY HOLD OFF
            clickedBtn.attr("aria-pressed", 'false');
            generateFnCommand(clickedBtn);
            console.log("RELEASED HOLD  ==> "+clickedBtn.attr('name'));      
        }else{
            if(btnState=='false'){
                // TOGGLE ON
                clickedBtn.attr("aria-pressed", 'true');
                generateFnCommand(clickedBtn);
                console.log("TOGGLE ON ==> "+clickedBtn.attr('name'));
            }else{
                // TOGGLE OFF
                clickedBtn.attr("aria-pressed", 'false');
                generateFnCommand(clickedBtn);
                console.log("TOGGLE OFF ==> "+clickedBtn.attr('name'));
            }
        }
    });

    // Hide/Show the Debug console
    $("#console-toggle").on('click',function(){
        pb = $(this).is(':checked');
        
        if (pb == true){
            $("#debug-console").show();
            setPreference("dbugConsole", true);
        } else {
            $("#debug-console").hide();
            setPreference("dbugConsole", false);
        }
    });

    // Send command written in console
    $("#button-sendCmd").on('click', function(){
        cmd = $("#cmd-direct").val();
        writeToStream(cmd);
    });

    // Clear the console log window
    $("#button-clearLog").on('click', function(){
       $("#log-box").html("");
    });

    // Function to toggle fullScreen viceversa
    $("#fs-toggle").on('click', function(){ 
        st = $(this).attr('state');
        var elem = document.documentElement;
        if(st == 'ws'){
            $(this).attr('state','fs');     

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        }else{
            $(this).attr('state','ws');  
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    });


});


