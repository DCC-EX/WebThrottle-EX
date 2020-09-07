/*  
  This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
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
window.speedStep = 2;
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
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

let pressed = false;

function getFunCurrentVal(fun){
    return window.functions[fun];
}
function setFunCurrentVal(fun, val){
    window.functions[fun]=val;
}
function setCV(val){
    window.cv = val;
    console.log("SET LOCO ID :=> "+val);
}
function getCV(){
    return window.cv
}
function setSpeed(sp){
    window.speed=sp;
}
function getSpeed(){
    return window.speed;
}
function setDirection(dir){
    window.direction=dir;
}
function getDirection(dir){
    return window.direction;
}

function loadmaps(){
    $("#select-map").empty();
    $("#select-map").append($("<option />").val("default").text("Default"));
    $.each(getWebData(), function() {
      $("#select-map").append($("<option />").val(this.mname).text(this.mname));
    });
}

function loadButtons(data){
    $("#fn-wrapper").empty();
    $.each(data.fnData, function(key, value){
        isPressed = value[0] != 0 ? true : false;
        btnType = value[1] != 0 ? "press" : "toggle";
        if(value[3]==1){
            $("#fn-wrapper").append(
            "<div class='formbuilder-button form-group field-button-fn'> <button class='btn-default btn fn-btn "+btnType+"' data-type='"+
            btnType+"' aria-pressed='"+isPressed+"' name='"+key+"'  id='"+key+"'>"+
            value[2]+"</button>"
            +"</div>");
        }
    });
    // Set height of throttle container according to functions panel
    $(".throttle-container").height($(".functionKeys").first().height());
}

function showBtnConfig(data){
    
    $("#fnModal").show();
    $('#fnModal').css({"top":"7%", "left": "18%"});
    $('#fnModal').draggable();
    $("#fnModal .fn-modal-content").empty();
    $("#fnModal .fn-modal-content").append('<div class="row header-row"><div class="column-2 header-col func-title">Map Name</div> <div class="column-5 header-col"><input type="text" class="fn-input" id="map-name" value="'+data.mname+'"/></div> <div class="column-3 header-col"></div></div>');
    $("#fnModal .fn-modal-content").append('<div class="row header-row"><div class="column-1 header-col">Function</div> <div class="column-4 header-col">Label</div> <div class="column-3 header-col">Button Type</div><div class="column-2 header-col">Visibility</div></div>');
    $.each(data.fnData, function(key, value){
        isPressed = value[0] != 0 ? true : false;
        btnType = value[1] != 0 ? "press" : "toggle";
        btnpress = value[1] == 1 ? "checked" : "";
        btnToggle = value[1] == 0 ? "checked" : "";
        fvisible = value[3] == 1 ? "checked" : "";
        $("#fnModal .fn-modal-content").append('<div class="row edit-row" id="'+key+'">'+ 
        '<div class="column-1 func-title">'+key +'</div>'+
        '<div class="column-4"> <input class="fn-input" name="'+key+'" id="'+key+'" value="'+value[2]+'"/>'+
        '<span class="focus-border"><i></i></span>'+
        '</div>'+
        '<div class="fn-radio column-3" name="'+key+'Type" id="'+key+'Type">'+
            '<input type="radio" id="'+key+'press" name="btn'+key+'Type" value="press" '+btnpress+'/>'+
            '<label for="'+key+'press">Press</label>  &nbsp;'+
            '<input type="radio" id="'+key+'toggle" name="btn'+key+'Type" value="toggle" '+btnToggle+'/>'+
            '<label for="'+key+'toggle">Toggle</label>'+ 
        '</div>'+
        '<div class="fn-chkbox column-2" name="'+key+'Visible" id="'+key+'Type">'+
            '<input type="checkbox" id="'+key+'Visible" name="'+key+'Visible" '+fvisible+'/>'+
            '<label for="'+key+'Visible">Show</label>  &nbsp;'+
        '</div>'+
        '</div>');
    });
}

function addNewMap(){
    customFnData = {};
    $(".edit-row").each(function(val){
        key = $(this).find(".func-title").text();
        btnType = $(this).children().find("input[type='radio']:checked").val() == "press" ? 1 : 0;
        fnvisible = $(this).children().find("input[type='checkbox']").prop('checked') ? 1 : 0;
        arr = [ 0, btnType, $(this).children().find(".fn-input").val(), fnvisible ];
        customFnData[key] = arr;             
    });
    mapName = $("#map-name").val();
    console.log(mapName);
    if(mapName){
        setLocoData({ mname: mapName , fnData: customFnData});
        $("#fnModal").hide();
    }else{
        alert("Name is missing!!");
    }
}

function editMap(){
    if(!ifExists()){
        customFnData = {};
        $(".edit-row").each(function(val){
            key = $(this).find(".func-title").text();
            btnType = $(this).children().find("input[type='radio']:checked").val() == "press" ? 1 : 0;
            fnvisible = $(this).children().find("input[type='checkbox']").prop('checked') ? 1 : 0;
            arr = [ 0, btnType, $(this).children().find(".fn-input").val(), fnvisible ];
            customFnData[key] = arr;             
        });
        mapName = $("#map-name").val();
        console.log(mapName);
        if(mapName){
            setLocoData({ mname: mapName , fnData: customFnData});
            $("#fnModal").hide();
        }else{
            alert("Name is missing!!");
        }
    }else{
        alert("Map with the Name already exists!! Please change the Map name.."); 
    }
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

    loadmaps();
    loadButtons({ mname: "default" , fnData: fnMasterData});

    $("#new-map").on('click', function(){
        $("#save-fn-map").attr("mode","new");
        $(".fn-heading").html("New Mapping");
        showBtnConfig({ mname: "" , fnData: fnMasterData});
    });

    $("#select-map").change(function () {
        selectedval = $(this).val();    
        if(selectedval != "default"){
            data  = getStoredFuncData(selectedval);
            loadButtons(data);
        }else{
            loadButtons({ mname: "default" , fnData: fnMasterData});
        }
    });

  $("#edit-map").on('click', function(){
        $("#save-fn-map").attr("mode","edit");
        $(".fn-heading").html("Edit Mapping");
        selectedval = $("#select-map").val();      
        if(selectedval != "default"){
        data  = getStoredFuncData(selectedval); 
        showBtnConfig(data);
    }
    //showBtnConfig();
  });

  $("#close-model").on('click', function(){
    $("#fnModal").hide();
  });

  $("#save-fn-map").on('click', function(){
    mode = $(this).attr("mode");
    // alert(mode); // debug line
    if(mode=="new"){
        addNewMap();  
    }else{
        editMap();
    }  
  });

    $("#button-connect").on('click',function(){
        toggleServer($(this));
    });

    $("#button-disconnect").on('click',function(){
        disconnectServer();
    });

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

            }else{

                currentCV = getCV();                     
                $("#ex-locoid").val(0);

                setCV(0);
                $("#loco-info").html("Released Locomotive: "+currentCV);
                acButton.data("acquired", false);
                acButton.html("Acquire");
                $("#throttle").roundSlider("disable");
            }
        }
    });   

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

    Tht = $("#throttle").roundSlider({
        width: 20,
        radius: 116,
        value: speed,
        circleShape: "pie",
        handleShape: "dot",
        startAngle: 315,
        lineCap: "round",
        sliderType: "min-range",
        showTooltip: false,
        handleSize: "+18",
        max: "128",
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
            console.log("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
           // console.log("This event is the combination of 'drag' and 'change' events.");
        },
        valueChange: function(slider){
            //setSpeed(slider.value);
            //writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
           // console.log("This event is similar to 'update' event, in addition it will trigger even the value was changed through programmatically also.");
        }
    });


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
                writeToStream("t 01 "+getCV()+" "+getSpeed()+" 1");
                break;
            }
            case "backward":
            { 
                setDirection(0);
                $("#throttle").roundSlider("enable");
                $("#throttle").roundSlider("setValue", getSpeed());
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
                break;
            }
        }

    });
    
    $("#button-hide").on('click',function(){
        if ($(".details-panel").is(":visible")){ 
            $(".details-panel").hide();
            $(this).html( 'Show <span class="arrow down"></span>');
        }else{
            $(".details-panel").show();
            $(this).html( 'Hide <span class="arrow up"></span>');
        }
       
    });

    var tId = 0;
    $("#button-right").on('mousedown', function() { 
        event.stopImmediatePropagation();
        tId = setInterval(function(){
            var sp = getSpeed();
            if((sp <= 125) && (getDirection() != -1) && (getCV() != 0)){
                setSpeed(sp+speedStep);                       
                $("#throttle").roundSlider("setValue", getSpeed());
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
            writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
            sp=0;
        }
        
    });

    
    var tId = 0;
    $("#button-left").on('mousedown', function() { 
        event.stopImmediatePropagation();
        tId = setInterval(function(){
            var sp = getSpeed(sp);
            if((sp >= 0) && (getDirection() != -1) && (getCV() != 0)){
                setSpeed(sp-speedStep);
                $("#throttle").roundSlider("setValue", getSpeed());
                writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
                sp=0;
            }
        }, 100); 
    }).on('mouseup mouseleave', function() { 
        clearInterval(tId); 
    }).on('click',function(){
        event.stopImmediatePropagation();
        var sp = getSpeed(sp);
        if((sp >= 0)&& (getDirection() != -1) && (getCV() != 0)){
            setSpeed(sp-speedStep);
            $("#throttle").roundSlider("setValue", getSpeed());
            writeToStream("t 01 "+getCV()+" "+getSpeed()+" "+getDirection());
            sp=0;
        }
    });
    
/* OLD SIMPLE FUNCTION FOR HISTORY - will Remove after Testing done
// Code Starts for Function buttons
$(".fn-btn").on('click', function() {
    clickedBtn = $(this);
    generateFnCommand(clickedBtn);
});  */
$(document).on('click', '.fn-btn',function() {  
    console.log("ON CLICK");  
});

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


$("#button-sendCmd").on('click', function(){
    cmd = $("#cmd-direct").val();
    writeToStream(cmd);
});




});

$(window).on('load', function(){
    
});