$(document).ready(function(){
    console.log("Command Controller loaded");
});

async function connectServer() {
    // Gets values of the connection method selector
    selectMethod = document.getElementById('select-method')
    mode = selectMethod.value;
    // Disables selector so it can't be changed whilst connected
    selectMethod.disabled = true;
    console.log("Set mode: "+mode)
    // Checks which method was selected
    if (mode == "serial") {
        try{
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
            return true;
        } catch (err) {
            console.log("User didn't select a port to connect to")
            return false;
        }
    } else{
        // If using the emulator
        emulator = true;
        // Displays dummy hardware message
        displayLog("DCC++ BASE STATION FOR EMULATOR / EMULATOR MOTOR SHIELD: V-1.0.0 / Feb 30 2020 13:10:04")
        return true;
    }
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
    // Stops data being written to nonexistent port if using emulator
    if (port) {
        const writer = outputStream.getWriter();
        lines.forEach((line) => {
            writer.write('<' + line + '>' + '\n');
            displayLog('[SEND]'+line.toString());
        });
        writer.releaseLock();
    } else {
        lines.forEach((line) => {
            displayLog('[SEND]'+line.toString());
        });
    }

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
    if (port) {
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
    } else {
        // Disables emulator
        emulator = undefined;
    }
    // Allows a new method to be chosen
    selectMethod.disabled = false;
}

// Connect or disconnect from the command station
async function toggleServer(btn) {
    // If already connected, disconnect
    if (port || emulator) {
        await disconnectServer();
        btn.attr('aria-state','Disconnected');
        btn.html("Connect DCC++ EX");
        return;
    }

    // Otherwise, call the connect() routine when the user clicks the connect button
    success = await connectServer();
    // Checks if the port was opened successfully
    if (success) {
        btn.attr('aria-state','Connected');
        btn.html("Disconnect DCC++ EX");
    } else {
        selectMethod.disabled = false;
    }
}

// Display log of events
function displayLog(data){

    $("#log-box").append("<br>"+data+"<br>");
    $("#log-box").animate({scrollTop: $("#log-box").prop("scrollHeight"), duration: 5});

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
