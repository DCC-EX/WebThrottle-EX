/*  This is part of the DCC-EX Project for model railroading and more.
    For licence information, please see index.html
    For more information, see us at dcc-ex.com.
    
    commandController.js
    
    Open a serial port and create a stream to read and write data
    While there is data, we read the results in loop function
*/
let commandString = "";

$(document).ready(function(){
    console.log("Command Controller loaded");
    uiDisable(true)
    emulatorClass = new Emulator({logger: displayLog});
});

// - Request a port and open an asynchronous connection, 
//   which prevents the UI from blocking when waiting for
//   input, and allows serial to be received by the web page
//   whenever it arrives.
async function connectServer() {
    // Gets values of the connection method selector
    selectMethod = document.getElementById('select-method')
    mode = selectMethod.value;
    // Disables selector so it can't be changed whilst connected
    selectMethod.disabled = true;
    console.log("Set Mode: "+mode)
    // Checks which method was selected
    if (mode == "serial") {
        try{
            // - Request a port and open an asynchronous connection, 
            //   which prevents the UI from blocking when waiting for
            //   input, and allows serial to be received by the web page
            //   whenever it arrives.
            
            port = await navigator.serial.requestPort(); // prompt user to select device connected to a com port
            // - Wait for the port to open.
            await port.open({ baudRate: 115200 });         // open the port at the proper supported baud rate

            // create a text encoder output stream and pipe the stream to port.writeable
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
            //.pipeThrough(new TransformStream(new JSONTransformer()));

            // get a reader and start the non-blocking asynchronous read loop to read data from the stream.
            reader = inputStream.getReader();
            readLoop();
            uiDisable(false)
            displayLog("[CONNECTION] Serial connected")
            return true;
        } catch (err) {
            console.log("User didn't select a port to connect to")
            return false;
        }
    } else{
        // If using the emulator
        emulatorMode = true;
        // Displays dummy hardware message
        displayLog("[ CONNECTION] Emulator connected")
        displayLog("[R] DCC-EX EXCOMMANDSTATION FOR EMULATOR / EMULATOR MOTOR SHIELD: V-1.0.0 / Feb 30 2020 13:10:04")
        uiDisable(false)
        return true;
    }
}

// While there is still data in the serial buffer us an asynchronous read loop
// to get the data and place it in the "value" variable. When "done" is true
// all the data has been read or the port is closed
async function readLoop() {
    while (true) {
        const { value, done } = await reader.read();
        // if (value && value.button) { // alternate check and calling a function
        // buttonPushed(value);

        let thisCommandString = "";

        if (value) {

            commandString = commandString + value;

            var moreToProcess = true;
            while (moreToProcess) {
                // displayLog('[RECEIVE] '+ value);
                // console.log('[RECEIVE] '+ value);

                let end = -1;

                for (i=0; i<commandString.length; i++) {
                    if ((commandString.charAt(i)=='\n') && (i>0)) {
                        end = i;
                        break;
                    }
                }

                if (end>=0) {
                    thisCommandString = commandString.substring(0,end);
                    if (end>0) { 
                        commandString = commandString.substring(end);
                        moreToProcess = true;
                    } else {
                        moreToProcess = false;
                    }
                    displayLog("[R] " + thisCommandString);
                    console.log(getTimeStamp() + " [R] " + thisCommandString);
                    parseResponse(thisCommandString); 
                } else {
                    moreToProcess = false;
                }        
            }
        }
        if (done) {
            console.log(getTimeStamp() + ' [readLoop] DONE '+done.toString());
            reader.releaseLock();
            break;
        }
    }
}

function parseResponse(cmd) {  // some basic ones only
    cmd = cmd.replaceAll('\n',"");
    cmd = cmd.replaceAll('\r',"");

    if ( (cmd.includes("Free RAM=")) && (!csIsReady)) {
        csIsReady = true;
        displayLog('<br><br>[i] EX-CommandStation is READY<br>');
        $("#button-getloco").removeClass("ui-state-disabled");
        $("#button-sendCmd").removeClass("ui-state-disabled");
        $("#ex-locoid").prop('disabled', false)
        $("#button-getloco").prop('disabled', false)
           
    } else if (cmd.charAt(0)=='<') {

        if (cmd.charAt(1)=='p') {
            if (cmd.charAt(2)=="0") {
                $("#power-switch").prop('checked', false)
                $("#power-status").html("is Off");
            } else {
                $("#power-switch").prop('checked', true)
                $("#power-status").html("is On");
            }

        } else if (cmd.charAt(1)=='i') {
            cmdArray = cmd.split(" ");
            versionText = "";
            if (cmdArray[1].charAt(0)=='V') //version
            try {
                versionText = cmdArray[1].substring(2,cmdArray[1].length);
                versionArray = versionText.split(".");
                csVersion = parseInt(versionArray[0])
                 + parseInt(versionArray[1]) / 100
                 + parseInt(versionArray[2]) / 100000;
                displayLog('[i] Version:' + csVersion);
            } catch (e) {
                console.log(getTimeStamp() + '[ERROR] Unable process version: ' + versionText + '  - ' + csVersion);
            }

        } else if (cmd.charAt(1)=='l') {
            cmdArray = cmd.split(" ");
            try {
                lastLocoReceived = parseInt(cmdArray[1]);
                let speedbyte = parseInt(cmdArray[3]);
                let functMap = parseInt(cmdArray[4]);
                lastSpeedReceived = 0;
                lastDirReceived = 0;
                if (getCV() == lastLocoReceived) {
                    if ((speedbyte>=2) && (speedbyte<=127)) {
                        lastSpeedReceived = speedbyte-1;
                        lastDirReceived = 1;
                    } else if ( (speedbyte>=130) && (speedbyte<=255) ) { 
                        lastSpeedReceived = speedbyte - 129;
                        lastDirReceived = 0;
                    }
                    let now = new Date();
                    if((getSecondSinceMidnight(now)- getSecondSinceMidnight(lastTimeSent)) > 0.1) { // don't respond if we sent a command in the specified period
                        setPositionOfDirectionSlider(lastDirReceived);
                        setPositionofControllers();
                        setDirection(lastDirReceived);
                        setSpeed(lastSpeedReceived);
                    }
                }
            } catch (e) {
                console.log(getTimeStamp + '[ERROR] Unable process speed commands');
            }
        }
    }
} 

function writeToStream(...lines) {
  // Stops data being written to nonexistent port if using emulator
  let stream = emulatorClass
  if (port) {
    stream = outputStream.getWriter();
  }

  lines.forEach((line) => {
      if (line == "\x03" || line == "echo(false);") {

      } else {
          displayLog("[S] &lt;" + line.toString() + "&gt;");
      }
      const packet = `<${line}>\n`;
      stream.write(packet)
      console.log(packet)
  });
  stream.releaseLock();
}

// Transformer for the Web Serial API. Data comes in as a stream so we
// need a container to buffer what is coming from the serial port and
// parse the data into separate lines by looking for the breaks
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

// Optional transformer for use with the web serial API
// to parse a JSON file into its component commands
class JSONTransformer {
    transform(chunk, controller) {
        // Attempt to parse JSON content
        try {
        controller.enqueue(JSON.parse(chunk));
        } catch (e) {
        //displayLog(chunk.toString());
        //displayLog(chunk);
        console.log('No JSON, dumping the raw chunk', chunk);
        controller.enqueue(chunk);
        }

    }
} 

async function disconnectServer() {
    if ($("#power-switch").is(':checked')) {
	  displayLog('[i] Turning off track power');
	  writeToStream('0');
	  $("#power-switch").prop('checked', false)
	  $("#power-status").html('Off');
    }   
    csIsReady = false;
    uiDisable(true)
    if (port) {
    // Close the input stream (reader).
        if (reader) {
            await reader.cancel();  // .cancel is asynchronous so must use await to wave for it to finish
            await inputDone.catch(() => {});
            reader = null;
            inputDone = null;
            console.log('close reader');
        }

        // Close the output stream.
        if (outputStream) {
            await outputStream.getWriter().close();
            await outputDone; // have to wait for  the azync calls to finish and outputDone to close
            outputStream = null;
            outputDone = null;
            console.log('close outputStream');
        }
        // Close the serial port.
        await port.close();
        port = null;
        console.log('close port');
        displayLog("[CONNECTION] Serial disconnected");
    } else {
        // Disables emulator
        emulatorMode = undefined;
        displayLog("[CONNECTION] Emulator disconnected");
    }
    // Allows a new method to be chosen
    selectMethod.disabled = false;
}

// Connect or disconnect from the command station
async function toggleServer(btn) {
    // If already connected, disconnect
    if (port || emulatorMode) {
        await disconnectServer();
        btn.attr('aria-state','Disconnected');
        btn.html('<span class="con-ind"></span>Connect EX-CS'); //<span id="con-ind"></span>Connect EX-CS
        return;
    }

    // Otherwise, call the connect() routine when the user clicks the connect button
    success = await connectServer();
    // Checks if the port was opened successfully
    if (success) {
        btn.attr('aria-state','Connected');
        btn.html('<span class="con-ind connected"></span>Disconnect EX-CS');
    } else {
        selectMethod.disabled = false;
    }
}

// Display log of events
function displayLog(data){
    data = data.replaceAll("\n","");
    data = data.replaceAll("\r","");
    data = data.replaceAll("<br>","\n");
    data = data.replaceAll("<","&lt;");
    data = data.replaceAll(">","&gt;");
    data = data.replaceAll("\n","<br>");
    if (data.length > 0) data = getTimeStamp() + " <b>" + data + "</b>";
    $("#log-box").append(data.toString()+"<br>");
    $("#log-box").scrollTop($("#log-box").prop("scrollHeight"));
}

// Function to generate commands for functions F0 to F4
function sendCommandForF0ToF4(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (128+getFunCurrentVal("f1")*1 + getFunCurrentVal("f2")*2 + getFunCurrentVal("f3")*4  + getFunCurrentVal("f4")*8 + getFunCurrentVal("f0")*16);
    writeToStream("f "+getCV()+" "+cabval);
    console.log("Command: "+ "f "+getCV()+" "+cabval);

}

// Function to generate commands for functions F5 to F8
function sendCommandForF5ToF8(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (176+getFunCurrentVal("f5")*1 + getFunCurrentVal("f6")*2 + getFunCurrentVal("f7")*4  + getFunCurrentVal("f8")*8);
    writeToStream("f "+getCV()+" "+cabval);
    console.log("Command: "+ "f "+getCV()+" "+cabval);

}

// Function to generate commands for functions F9 to F12
function sendCommandForF9ToF12(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (160+getFunCurrentVal("f9")*1 + getFunCurrentVal("f10")*2 + getFunCurrentVal("f11")*4  + getFunCurrentVal("f12")*8);
    writeToStream("f "+getCV()+" "+cabval);
    console.log("Command: "+ "f "+getCV()+" "+cabval);

}

// Function to generate commands for functions F13 to F20
function sendCommandForF13ToF20(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (getFunCurrentVal("f13")*1 + getFunCurrentVal("f14")*2 + getFunCurrentVal("f15")*4  + getFunCurrentVal("f16")*8 + getFunCurrentVal("f17")*16 + getFunCurrentVal("f18")*32 + getFunCurrentVal("f19")*64 + getFunCurrentVal("f20")*128);
    writeToStream("f "+getCV()+" 222 "+cabval);
    console.log("Command: "+ "f "+getCV()+" 222 "+cabval);

}

// Function to generate commands for functions F21 to F28
function sendCommandForF21ToF28(fn, opr){
    setFunCurrentVal(fn,opr);
    cabval = (getFunCurrentVal("f21")*1 + getFunCurrentVal("f22")*2 + getFunCurrentVal("f23")*4  + getFunCurrentVal("f24")*8 + getFunCurrentVal("f25")*16 + getFunCurrentVal("f26")*32 + getFunCurrentVal("f27")*64 + getFunCurrentVal("f28")*128);
    writeToStream("f "+getCV()+" 223 "+cabval);
    console.log("Command: "+ "f "+getCV()+" 223 "+cabval);

}

function getTimeStamp() {
    var now = new Date();
    return (//(now.getFullYear()) + '/' +
            // (now.getMonth()+1) + '/' +
            // now.getDate() + " " +
             now.getHours() + ':' +
             ((now.getMinutes() < 10)
                 ? ("0" + now.getMinutes())
                 : (now.getMinutes())) + ':' +
             ((now.getSeconds() < 10)
                 ? ("0" + now.getSeconds())
                 : (now.getSeconds())));
}

function getSecondSinceMidnight(myDate) {
    var seconds = myDate.getHours() * 60 * 60; 
    seconds = seconds + myDate.getMinutes() * 60;
    seconds = seconds + myDate.getSeconds();
    seconds = seconds + (myDate.getMilliseconds() / 1000);
    return seconds;
}

function copyLogToClipboard() {
    let text = document.getElementById('log-box').innerText;
    text = "```\n" + text + "\n```"
    navigator.clipboard.writeText(text);
    console.log('[i] Content copied to clipboard');
    displayLog("[i] Content copied to clipboard");
}