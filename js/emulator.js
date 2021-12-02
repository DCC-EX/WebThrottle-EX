/*  This is part of the DCC++ EX Project for model railroading and more.
    For licence information, please see index.html.
    For more information, see us at dcc-ex.com.

    emulator.js

    Allows the software to operate without a Command Station attached. This 
    file manages the correct response that a Command Station would provide.
*/

function cabControlCommand(splitPacket) {
  return 'T 1 ' + splitPacket[3] + ' ' + splitPacket[4].substring(0, splitPacket[4].length - 2);
}

function powerOffCommand(_splitPacket) {
  return 'p0';
}

function powerOnCommand(_splitPacket) {
  return 'p1';
}

function cabFunctionCommand(_splitPacket, legacy = false) {
  return NaN;
}

function turnoutCommand(splitPacket) {
  const turnouts = [];
  let returnList;
  if (splitPacket.length === 4) {
    turnouts.push({id: splitPacket[1], address: splitPacket[2], subaddress: splitPacket[3], throw: 0})
    return '<O>';
  } else if (splitPacket.length === 2) {
    var i;
    for (i = 0; i < turnouts.length; i++) {
      if (turnouts[i]['id'] == splitPacket[1].substring(0, splitPacket[1].length - 1)) {
        turnouts.splice(i, 1);
        return 'O';
      }
    }
    return 'X';
  } else if (splitPacket.length === 1) {
    returnList = [];
    if (turnouts.length > 0) {
      for (i = 0; i < turnouts.length; i++) {
        returnList.push('H ' + turnouts[i]['id'] + ' ' + turnouts[i]['address'] + ' ' + turnouts[i]['subaddress'] + ' ' + turnouts[i]['throw']);
      }
      return returnList;
    }
    return 'X';
  }
}


function emulator(packet) {
  if (packet === "<credits>") {
    console.log("Credits")
    return credits()
  }

  const cleanedPacket = [...packet].filter(char => !["<", ">"].includes(char))
  let packetKey = cleanedPacket.find(char => char !== " ");

  const splitPacket = packet.split(" ");
  switch (packetKey) {
    // Cab control
    case ("t"):
      return cabControlCommand(splitPacket)

    // Track power off
    case ('0') :
      return powerOffCommand(splitPacket);

    // Track power on
    case ('1'):
      return powerOnCommand(splitPacket);

    // New cab functions
    case ('F'):
      return cabFunctionCommand(splitPacket);

    // Legacy cab functions
    case ('f'):
      return cabFunctionCommand(splitPacket, true);

    // Turnouts
    case ('T'): //Not fully finished
      return turnoutCommand(splitPacket);
  }
}
