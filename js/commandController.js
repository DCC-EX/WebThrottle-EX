/*  This is part of the DCC-EX Project for model railroading and more.
    For licence information, please see index.html
    For more information, see us at dcc-ex.com.
    
    commandController.js
    
    Open a serial port and create a stream to read and write data
    While there is data, we read the results in loop function
*/
let commandString = "";

$(document).ready(function () {
    console.log("Command Controller loaded");
    emulatorClass = new Emulator({ logger: displayLog });
    uiDisable(true)
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
    console.log("Set Mode: " + mode)
    // Checks which method was selected
    if (mode == "serial") {
        try {
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
    } else {
        // If using the emulator
        emulatorMode = true;
        // Displays dummy hardware message
        displayLog("[CONNECTION] Emulator connected")
        displayLog("[R] DCC-EX EXCOMMANDSTATION FOR EMULATOR / EMULATOR MOTOR SHIELD: V-1.0.0 / Feb 30 2020 13:10:04")
        uiEnableThrottleControlOnReady();
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

                for (i = 0; i < commandString.length; i++) {
                    if ((commandString.charAt(i) == '\n') && (i > 0)) {
                        end = i;
                        break;
                    }
                }

                if (end >= 0) {
                    thisCommandString = commandString.substring(0, end);
                    if (end > 0) {
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
            console.log(getTimeStamp() + ' [readLoop] DONE ' + done.toString());
            reader.releaseLock();
            break;
        }
    }
}

function parseResponse(cmd) {  // some basic ones only
    cmd = cmd.replaceAll('\n', "");
    cmd = cmd.replaceAll('\r', "");

    if (!csIsReadyRequestSent) {
        writeToStream("s");
        csIsReadyRequestSent = true;
    } else if ( ((cmd.includes("<iDCC")) || (cmd.includes("RAM=")))  
                && (!csIsReady) ) {
        csIsReady = true;
        uiEnableThrottleControlOnReady();
    } else if (cmd.charAt(0) == '<') {

        cmdArray = cmd.split(" ");

        if (cmd.charAt(1) == 'p') {
            if (cmd.charAt(2) == "0") {
                $("#power-switch").prop('checked', false)
                $("#power-status").html("is Off");
            } else {
                $("#power-switch").prop('checked', true)
                $("#power-status").html("is On");
            }

        } else if (cmd.charAt(1) == 'i') {
            versionText = "";
            if (cmdArray[1].charAt(0) == 'V') //version
                try {
                    versionText = cmdArray[1].substring(2, cmdArray[1].length);
                    versionArray = versionText.split(".");
                    csVersion = parseInt(versionArray[0])
                        + parseInt(versionArray[1]) / 100
                        + parseInt(versionArray[2]) / 100000;
                    displayLog('[i] Version:' + csVersion);
                } catch (e) {
                    console.log(getTimeStamp() + '[ERROR] Unable process version: ' + versionText + '  - ' + csVersion);
                }

        } else if (cmd.charAt(1) == 'l') {
            try {
                lastLocoReceived = parseInt(cmdArray[1]);
                let speedbyte = parseInt(cmdArray[3]);
                let functMap = parseInt(cmdArray[4]);
                if (getCV() == lastLocoReceived) {

                    let now = new Date();
                    lastTimeReceived = now;
                    if ((getSecondSinceMidnight(now) - getSecondSinceMidnight(lastTimeSent)) > 0.1) {
                        if ((speedbyte >= 2) && (speedbyte <= 127)) { // reverse
                            lastSpeedReceived = speedbyte - 1;
                            lastDirReceived = DIRECTION_REVERSED;
                        } else if ((speedbyte >= 130) && (speedbyte <= 255)) { //forward
                            lastSpeedReceived = speedbyte - 129;
                            lastDirReceived = DIRECTION_FORWARD;
                        } else if (speedbyte == 0) { //stop
                            lastSpeedReceived = 0;
                            lastDirReceived = DIRECTION_REVERSED;
                        } else if (speedbyte == 128) { //stop
                            lastSpeedReceived = 0;
                            lastDirReceived = DIRECTION_FORWARD;
                        } else {
                            lastSpeedReceived = 0;
                            lastDirReceived = getDirection();
                        }

                        setDirection(lastDirReceived);
                        setSpeed(lastSpeedReceived);
                        setPositionOfDirectionSlider(lastDirReceived);
                        setPositionofControllers();
                    } else {
                        displayLog('[i] Ignoring Received Speed - too soon since last speed send.');
                    }
                    for (i = 0; i <= 28; i++) {
                        fnState = (functMap >> i) & 0x1;
                        fnStateText = (fnState == 1) ? "true" : "false";
                        if (getFunCurrentVal("f" + i) != fnStateText) {
                            $("#f" + i).attr("aria-pressed", fnStateText);
                        }
                    }
                }
            } catch (e) {
                console.log(getTimeStamp + '[ERROR] Unable to process speed commands');
            }
        } else if ((cmd.charAt(1) == 'r') && (cmdArray.length == 2)) {
            try {
                locoAddr = parseInt(cmdArray[1]);
                if (locoAddr > 0) {
                    $("#cv-locoid").val(locoAddr);
                } else {
                    displayLog("[i] DCC Address Read Failed!");
                }
            } catch (e) {
                console.log(getTimeStamp + '[ERROR] Unable to process read address response');
            }
        } else if (cmd.charAt(1) == 'w') {
            try {
                locoAddr = parseInt(cmdArray[1]);
                if (locoAddr > 0) {

                } else {
                    displayLog("[i] DCC Address Write Failed!");
                }
            } catch (e) {
                console.log(getTimeStamp + '[ERROR] Unable to process write address response');
            }
        } else if ((cmd.charAt(1) == 'v') || (cmd.charAt(1) == 'r')) {
            try {
                cvid = parseInt(cmdArray[1]);
                cvValue = parseInt(cmdArray[2]);
                if ((cvid > 0) && (cvValue > -1)) {
                    $("#cv-cvid").val(cvid);
                    $("#cv-cvvalue").val(cvValue);

                    if (cvid==29) {
                        if (!isBitOn(cvValue, 1)) {
                            displayLog("CV29- Direction: Forward");
                        }  else {
                            displayLog("CV29- Direction: Reverse");
                        }
                        if (!isBitOn(cvValue, 2)) {
                            displayLog("CV29- Speed Steps: 14");
                        }  else {
                            displayLog("CV29- Speed Steps: 28/128");
                        }
                        if (!isBitOn(cvValue, 3)) {
                            displayLog("CV29- Analogue Conversion: Off");
                        }  else {
                            displayLog("CV29- Analogue Conversion: On");
                        }
                        if (!isBitOn(cvValue, 5)) {
                            displayLog("CV29- Speed Table: Not Used (uses CV 2,5 & 6)");
                        }  else {
                            displayLog("CV29- Speed Table: Enabled");
                        }
                        if (!isBitOn(cvValue, 6)) {
                            displayLog("CV29- Address Size: 2 bit (Short 1-127)");
                        }  else {
                            displayLog("CV29- Address Size: 4 bit (Long 128-10239)");
                        }

                        displayLog("CV29- Write a value of " + toggleBit(cvValue,1) + " to CV29 to toggle the direction");
                        displayLog("CV29- Write a value of " + toggleBit(cvValue,5) + " to CV29 to toggle the Speed Table usage");

                    }
                } else {
                    displayLog("[i] CV Read/Write Failed!");
                }
            } catch (e) {
                console.log(getTimeStamp + '[ERROR] Unable to process read CV response');
            }
        }
    }
}

function writeToStream(...lines) {
    // Stops data being written to nonexistent port if using emulator
    if (emulatorClass == null) displayLog("[i] emulatorClass is null");
    let stream = emulatorClass;
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
    csIsReadyRequestSent = false;
    uiDisable(true)
    if (port) {
        // Close the input stream (reader).
        if (reader) {
            await reader.cancel();  // .cancel is asynchronous so must use await to wave for it to finish
            await inputDone.catch(() => { });
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
        btn.attr('aria-state', 'Disconnected');
        btn.html('<span class="con-ind"></span>Connect EX-CS'); //<span id="con-ind"></span>Connect EX-CS
        return;
    }

    // Otherwise, call the connect() routine when the user clicks the connect button
    success = await connectServer();
    // Checks if the port was opened successfully
    if (success) {
        btn.attr('aria-state', 'Connected');
        btn.html('<span class="con-ind connected"></span>Disconnect EX-CS');
    } else {
        selectMethod.disabled = false;
    }
}

// Display log of events
function displayLog(data) {
    data = data.replaceAll("\n", "");
    data = data.replaceAll("\r", "");
    data = data.replaceAll("\\n", "");
    data = data.replaceAll("\\r", "");
    data = data.replaceAll("\\0", "");
    data = data.replaceAll("<br>", "\n");
    data = data.replaceAll("<", "&lt;");
    data = data.replaceAll(">", "&gt;");
    data = data.replaceAll("\n", "<br>");
    if (data.length > 0) data = getTimeStamp() + " <b>" + data + "</b>";
    $("#log-box").append(data.toString() + "<br>");
    $("#log-box").scrollTop($("#log-box").prop("scrollHeight"));

    $("#log-box2").append(data.toString() + "<br>");
    $("#log-box2").scrollTop($("#log-box2").prop("scrollHeight"));
}


// Function to generate commands for functions F0 to F28
function sendCommandForFunction(fn, opr) {
    setFunCurrentVal("f" + fn, opr);
    writeToStream("F " + getCV() + " " + fn + " " + getFunCurrentVal("f" + fn));
    console.log("Command: " + "F " + getCV() + " " + fn + " " + getFunCurrentVal("f" + fn));
}


function getTimeStamp() {
    if (getPreference("timestamp")=="off") return "";

    var now = new Date();
    var startOfSec = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
    var millsecs = now.getMilliseconds() - startOfSec.getMilliseconds();
    return (//(now.getFullYear()) + '/' +
        // (now.getMonth()+1) + '/' +
        // now.getDate() + " " +
        now.getHours() + ':' +
        ((now.getMinutes() < 10)
            ? ("0" + now.getMinutes())
            : (now.getMinutes())) + ':' +
        ((now.getSeconds() < 10)
            ? ("0" + now.getSeconds())
            : (now.getSeconds()))) + ":" +
        ((millsecs < 10)
            ? ("00" + millsecs)
            : ((millsecs < 100)
                ? ("0" + millsecs)
                : (millsecs)));
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

function isBitOn(n, index) {
    i = index - 1;
    // return Boolean(number & (1 << index));

    var mask = 1 << i; // gets the i'th bit
    if ((n & mask) != 0) {
        return true;
    } else {
        return false;
    }
 }

 function toggleBit(n, index) {
    i = index - 1 ;
    var mask = 1 << i; // gets the index'th bit
    n ^= mask;
    return n;
 }

function browserType() {
    let userAgent = navigator.userAgent;
    let browser = "Unknown";
    let browserOk = false;
    
    // Detect Chrome
    if (/Chrome/.test(userAgent) && !/Chromium/.test(userAgent)) {
        browser = "Google Chrome (Chromium)";
        browserOk = true;
    }
    // Detect Chromium-based Edge
    else if (/Edg/.test(userAgent)) {
        browser = "Microsoft Edge (Chromium)";
        browserOk = true;
    }
    // Detect Opera
    else if (/Opera/.test(userAgent)) {
        browser = "Opera (Chromium)";
        browserOk = true;
    }
    // Detect Firefox
    else if (/Firefox/.test(userAgent)) {
        browser = "Mozilla Firefox";
    }
    // Detect Safari
    else if (/Safari/.test(userAgent)) {
        browser = "Apple Safari";
    }
    // Detect Internet Explorer
    else if (/Trident/.test(userAgent)) {
        browser = "Internet Explorer";
    }

    if (!browserOk) {
        window.alert("EX-WebThrottle is only known to work on Chromium based web browsers. (i.e. Chrome, Edge, Opera).\n\n Your browser is NOT one of these, so EX-WebThrottle will likely not work. You will not be able to select or interact with the USB port.")
    }
    return "Browser: " + browser;
}