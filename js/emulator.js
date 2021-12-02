/*  This is part of the DCC++ EX Project for model railroading and more.
    For licence information, please see index.html.
    For more information, see us at dcc-ex.com.

    emulator.js

    Allows the software to operate without a Command Station attached. This 
    file manages the correct response that a Command Station would provide.
*/

function emulator(packet) {
  const turnouts = [];

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
      return 'T 1 ' + splitPacket[3] + ' ' + splitPacket[4].substring(0, splitPacket[4].length - 2)

    // Track power off
    case ('0') :
      return 'p0';

    // Track power on
    case ('1'):
      return 'p1';

    // New cab functions
    case ('F'):
      return NaN;

    // Legacy cab functions
    case ('f'):
      return NaN;

    // Turnouts
    case ('T'): //Not fully finished
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
}
