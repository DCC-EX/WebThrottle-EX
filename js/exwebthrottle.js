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


async function connectServer() {
    // - Request a port and open an asynchronous connection, 
    //   which prevents the UI from blocking when waiting for
    //   input, and allows serial to be received by the web page
    //   whenever it arrives.
    
    port = await navigator.serial.requestPort(); // prompt user to select device connected to a com port
    // - Wait for the port to open.
    await port.open({ baudrate: 115200 });         // open the port at the proper supported baud rate

    // create a text encoder stream and pipe the stream to port.writeable
    const encoder = new TextEncoderStream();
    outputDone = encoder.readable.pipeTo(port.writable);
    outputStream = encoder.writable;

    // To put the system into a known state and stop it from echoing back the characters that we send it, 
    // we need to send a CTRL-C and turn off the echo
    writeToStream('\x03', 'echo(false);');

    // Create an input stream and a reader to read the data. port.readable gets the readable stream
    // DCC++ commands are text, so we will pipe it through a text decoder. 
    let decoder = new TextDecoderStream();
    inputDone = port.readable.pipeTo(decoder.writable);
    inputStream = decoder.readable
    //  .pipeThrough(new TransformStream(new LineBreakTransformer())); // added this line to pump through transformer
    .pipeThrough(new TransformStream(new JSONTransformer()));

    // get a reader and start the non-blocking asynchronous read loop to read data from the stream.
    reader = inputStream.getReader();
    readLoop();

}
async function readLoop() {
    while (true) {
        const { value, done } = await reader.read();
        // if (value && value.button) { // alternate check and calling a function
        // buttonPushed(value);
        if (value) {
            displayLog(value);
        }
        if (done) {
            console.log('[readLoop] DONE'+done.toString());
            displayLog('[readLoop] DONE'+done.toString());
            reader.releaseLock();
            break;
        }
    }
}
function writeToStream(...lines) {
    const writer = outputStream.getWriter();
    lines.forEach((line) => {
        writer.write('<' + line + '>' + '\n');
        displayLog('[SEND]'+line.toString());
    });
    writer.releaseLock();

}
class LineBreakTransformer {
        constructor() {
            // A container for holding stream data until it sees a new line.
            this.container = '';
        }

        transform(chunk, controller) {
            // Handle incoming chunk
            this.container += chunk;                      // add new data to the container 
            const lines = this.container.split('\r\n');   // look for line breaks and if it finds any
            this.container = lines.pop();                 // split them into an array
            lines.forEach(line => controller.enqueue(line)); // iterate parsed lines and send them

        }

        flush(controller) {
            // When the stream is closed, flush any remaining data
            controller.enqueue(this.container);

        }
}
class JSONTransformer {
    transform(chunk, controller) {
        // Attempt to parse JSON content
        try {
        controller.enqueue(JSON.parse(chunk));
        } catch (e) {
        displayLog(chunk.toString());
        console.log('No JSON, dumping the raw chunk', chunk);
        controller.enqueue(chunk);
        }

    }
}                   
async function disconnectServer() {
    if ($("#power-switch").is(':checked')) {
	  $("#log-box").append('<br>'+'turn off power'+'<br>');
	  writeToStream('0');
	  $("#power-switch").prop('checked', false)
	  $("#power-status").html('Off');
	}
    // Close the input stream (reader).
    if (reader) {
        await reader.cancel();  // .cancel is asynchronous so must use await to wave for it to finish
        await inputDone.catch(() => {});
        reader = null;
        inputDone = null;
		displayLog('close reader');
    }

    // Close the output stream.
    if (outputStream) {
        await outputStream.getWriter().close();
        await outputDone; // have to wait for  the azync calls to finish and outputDone to close
        outputStream = null;
        outputDone = null;
		displayLog('close outputStream');
    }
    // Close the serial port.
    await port.close();
    port = null;
	displayLog('close port');

}
async function toggleServer(btn) {
    // If already connected, disconnect
    if (port) {
        await disconnectServer();
        btn.attr('aria-state','Disconnected');
        btn.html("Connect DCC++ EX");
        return;
    }

    // Otherwise, call the connect() routine when the user clicks the connect button
    await connectServer();
    btn.attr('aria-state','Connected');
    btn.html("Disconnect DCC++ EX");
}

function displayLog(data){

    $("#log-box").append("<br>"+data+"<br>");
    $("#log-box").animate({scrollTop: $("#log-box").prop("scrollHeight"), duration: 5});

}


$(document).ready(function(){

    $.each(fndata, function(key, value){
        console.log(value.toString());
        isPressed = value[0] != 0 ? true : false;
        btnType = value[1] != 0 ? "press" : "toggle";
        $("#fn-wrapper").append(
         "<div class='formbuilder-button form-group field-button-fn'> <button type='button' class='btn-default btn fn-btn "+btnType+"' data-type='"+
         btnType+"' aria-pressed='"+isPressed+"' name='"+key+"'  id='"+key+"'>"+
         value[2]+"</button>"
         +"</div>");
    });

  $("#edit-labels").on('click', function(){
      $("#fnModal").show();
      $("#fnModal .fn-modal-content").empty();
      $("#fnModal .fn-modal-content").append('<div class="row header-row"><div class="column-1 header-col">Function</div> <div class="column-3 header-col">Label</div> <div class="column-2 header-col">Button Type</div></div>');
      $.each(fndata, function(key, value){
        isPressed = value[0] != 0 ? true : false;
        btnType = value[1] != 0 ? "press" : "toggle";
        $("#fnModal .fn-modal-content").append('<div class="row edit-row" id="'+key+'">'+ 
        '<div class="column-1 func-title">'+key +'</div>'+
        '<div class="column-3"> <input class="fn-input effect-8" name="'+key+'" id="'+key+'" value="'+value[2]+'"/>'+
        '<span class="focus-border">'+
        '<i></i>'+
        '</span></div>'+
        '<div class="fn-radio column-3" name="'+key+'Type" id="'+key+'Type">'+
            '<input type="radio" id="'+key+'press" name="btn'+key+'Type" value="press"/>'+
            '<label for="'+key+'press">Press</label>  &nbsp;'+
            '<input type="radio" id="'+key+'toggle" name="btn'+key+'Type" value="toggle" checked/>'+
            '<label for="'+key+'toggle">Toggle</label>'+
        '</div>'+
        '</div>');
      });
  });

  $("#close-model").on('click', function(){
    $("#fnModal").hide();
  });

  $("#save-fn").on('click', function(){
    customFnData = {};
    $(".edit-row").each(function(val){
        key = $(this).find(".func-title").text();
        btnType = $(this).children().find("input[type='radio']:checked").val() == "press" ? 1 : 0;
        arr = [ 0, btnType, $(this).children().find(".fn-input").val(), 1 ];
        customFnData[key] = arr;             
    });
    locoData = [];
    locoData.push({ id: 23 , fnData: customFnData});
    console.log(locoData);
    $("#fnModal").hide();
    locodata = window.localStorage.getItem('locoData');
    if( locodata == null ){
        x = window.localStorage.setItem('locoData', JSON.stringify(locoData));
        console.log(x);
    }else{
        console.log(JSON.parse(locodata));
        window.localStorage.setItem('locoData', null);
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
        startAngle: 316,
        lineCap: "round",
        sliderType: "min-range",
        handleSize: "+15",
        max: "128",
        disabled: true,
        create: function(){
            //console.log("This will trigger just before creation of throttle slider UI");
        },
        start: function(){
            //console.log("This event triggered when the user starts to drag the handle.");
        },
        stop: function(){
            //console.log("This event triggered when the user stops from sliding the handle / when releasing the handle.");
        },
        beforeValueChange: function(){
            //console.log("This event will be triggered before the value change happens.");
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


var timer= 0;
$(".fn-btn").on('mousedown', function() {    
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
}).on('mouseup mouserelease', function() {
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


function sendCommandForF0ToF4(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (128+getFunCurrentVal("f1")*1 + getFunCurrentVal("f2")*2 + getFunCurrentVal("f3")*4  + getFunCurrentVal("f4")*8 + getFunCurrentVal("f0")*16);
    writeToStream("f "+getCV()+" "+cabval);
    console.log("Command: "+ "f "+getCV()+" "+cabval);

}

function sendCommandForF5ToF8(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (176+getFunCurrentVal("f5")*1 + getFunCurrentVal("f6")*2 + getFunCurrentVal("f7")*4  + getFunCurrentVal("f8")*8);
    writeToStream("f "+getCV()+" "+cabval);
    console.log("Command: "+ "f "+getCV()+" "+cabval);

}

function sendCommandForF9ToF12(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (160+getFunCurrentVal("f9")*1 + getFunCurrentVal("f10")*2 + getFunCurrentVal("f11")*4  + getFunCurrentVal("f12")*8);
    writeToStream("f "+getCV()+" "+cabval);
    console.log("Command: "+ "f "+getCV()+" "+cabval);

}

function sendCommandForF13ToF20(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (getFunCurrentVal("f13")*1 + getFunCurrentVal("f14")*2 + getFunCurrentVal("f15")*4  + getFunCurrentVal("f16")*8 + getFunCurrentVal("f17")*16 + getFunCurrentVal("f18")*32 + getFunCurrentVal("f19")*64 + getFunCurrentVal("f20")*128);
    writeToStream("f "+getCV()+" 222 "+cabval);
    console.log("Command: "+ "f "+getCV()+" 222 "+cabval);

}

function sendCommandForF21ToF28(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (getFunCurrentVal("f21")*1 + getFunCurrentVal("f22")*2 + getFunCurrentVal("f23")*4  + getFunCurrentVal("f24")*8 + getFunCurrentVal("f25")*16 + getFunCurrentVal("f26")*32 + getFunCurrentVal("f27")*64 + getFunCurrentVal("f28")*128);
    writeToStream("f "+getCV()+" 223 "+cabval);
    console.log("Command: "+ "f "+getCV()+" 223 "+cabval);

}


// This function will generate commands for each type of function
function generateFnCommand(clickedBtn){
    
       func = clickedBtn.attr('name'); // Gives function name (F1, F2, .... F16)
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

});

