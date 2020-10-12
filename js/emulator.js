/*  This is part of the DCC++ EX Project for model railroading and more.
    For licence information, please see index.html.
    For more information, see us at dcc-ex.com.

    emulator.js

    Allows the software to operate without a Command Station attached. This 
    file manages the correct response that a Command Station would provide.
*/

let lastMessage;
var turnouts = [];
function emulator(packet) {
    console.log(packet)
    if (packet == "<credits>") {
        console.log("Credits")
        return credits()
    } else {
    console.log("after if")
    packetKey = packet[1];
    if (packetKey == ' ') {
        packetKey = packet[2];
    }
    packet = packet.split(" ");
    switch (packetKey) {
        // Cab control
        case ("t"):
            lastMessage = 'T 1 '+ packet[3] + ' ' + packet[4].substring(0, packet[4].length-2)
            return lastMessage;
            
        // Track power off
        case ('0') :
            lastMessage = 'p0';
            return lastMessage;

        // Track power on
        case ('1'):
            lastMessage = 'p1';
            return lastMessage;

        // New cab functions
        case ('F'):
            return NaN;
        
        // Legacy cab functions
        case ('f'):
            return NaN;
        
        // Turnouts
        case ('T'): //Not fully finished
            if (packet.length == 4) {
                turnouts.push({id: packet[1], address: packet[2], subaddress: packet[3], throw: 0})
                return '<O>';
            } else if (packet.length == 2) {
                var i;
                for (i=0; i<turnouts.length; i++ ) {
                    if (turnouts[i]['id'] == packet[1].substring(0, packet[1].length-1)) {
                        turnouts.splice(i, 1);
                        return 'O';
                    }
                }
                return 'X';
            } else if (packet.length == 1) {
                returnList = [];
                if (turnouts.length > 0) {
                    for (i=0; i<turnouts.length; i++){
                        returnList.push('H '+turnouts[i]['id']+' '+turnouts[i]['address']+' '+turnouts[i]['subaddress']+' '+turnouts[i]['throw']);
                    }
                return returnList;
                }
                return 'X';
            }
        }
    }
}