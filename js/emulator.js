/*  This is part of the DCC-EX Project for model railroading and more.
    For licence information, please see index.html.
    For more information, see us at dcc-ex.com.

    emulator.js

    Allows the software to operate without a Command Station attached. This 
    file manages the correct response that a Command Station would provide.
*/
/**
 * Utility function can be moved when we can import files
 * @description Removes control characters "<", ">" and "\n"
 * @param {string} packet
 * @return {string}
 */
function removeControlCharacters(packet) {
  return [...packet].filter(char => !["<", ">", "\n"].includes(char)).join("")
}

/**
 * Utility function can be moved when we can import files
 * @description Finds the first non-blank character after control characters are removed
 * @param {string} packet
 * @return {string}
 */
function extractPacketKey(packet) {
  const cleanedPacket = [...removeControlCharacters(packet)];
  return cleanedPacket.find(char => char !== " ");
}

class Emulator {
  constructor({logger}) {
    this.turnoutEmulator = new TurnoutEmulator();
    this.logger = logger;
  }

  /**
   * @param {string} packet
   */
  write(packet) {
    if (packet === "<credits>") {
      console.log("Credits");
      return credits();
    }

    let packetKey = extractPacketKey(packet);

    switch (packetKey) {
      // Cab control
      case ("t"):
        this.logger('[R] '+ this.#cabControlCommand(packet));
        break;

      // Track power off
      case ('0') :
        this.logger('[R] '+ this.#powerOffCommand(packet));
        break;

      // Track power on
      case ('1'):
        this.logger('[R] '+ this.#powerOnCommand(packet));
        break;

      // New cab functions
      case ('F'):
        this.logger('[R] '+  this.#cabFunctionCommand(packet));
        break;

      // Legacy cab functions
      case ('f'):

        this.logger('[R] '+  this.#cabFunctionCommand(packet, true));
        break;

      // Turnouts
      case ('T'): //Not fully finished
        this.logger('[R] '+  this.#turnoutCommand(packet, this.turnoutEmulator));
        break;

      default:
        break;
    }
  }

  /**
   * @param {string} packet
   * @return {string}
   */
  #cabControlCommand(packet) {
    const splitPacket = packet.split(" ");
    let mySpeed = parseInt(splitPacket[2]);
    let myDir = parseInt(splitPacket[3]);
    let speedByte = 0;
    if (myDir==1) { //forward
      if (mySpeed==0) {
        speedByte = 128;
      } else {
        speedByte = mySpeed + 1;
      }
    } else { //reverse
      if (mySpeed==0) {
        speedByte = 0;
      } else {
        speedByte = mySpeed + 129;
      }
    }
    return '<l ' + splitPacket[1] + ' ' + speedByte + ' ' + 0 +'>';
  }

  /**
   * @param {string} packet
   * @return {string}
   */
  #powerOffCommand(packet) {
    return '<p0>';
  }

  /**
   * @param {string} packet
   * @return {string}
   */
  #powerOnCommand(packet) {
    return '<p1>';
  }

  /**
   * @param {string} packet
   * @param {boolean} legacy
   * @return number
   */
  #cabFunctionCommand(packet, legacy = false) {
    return NaN;
  }
 
  /**
   * @param {string} packet
   * @param {TurnoutEmulator} turnoutEmulator
   * @return {string}
   */
  #turnoutCommand(packet, turnoutEmulator = new TurnoutEmulator()) {
    const splitPacket = removeControlCharacters(packet).split(" ");

    if (splitPacket.length === 4) {
      // Adds a Turnout
      return turnoutEmulator.addTurnout(new Turnout(packet));
    } else if (splitPacket.length === 2) {
      // Removes a Turnout
      return turnoutEmulator.removeTurnout(splitPacket[1]);
    } else if (splitPacket.length === 1) {
      // Reads Turnouts
      return turnoutEmulator.turnouts;
    }
  }

  // Prevents a type error during runtime
  releaseLock() {
  }
}

class TurnoutEmulator {
  /**
   * @type {[]}
   */
  #turnouts = []

  /**
   * @return {string|string[]}
   */
  get turnouts() {
    if (!this.#turnouts.length) {
      return 'X';
    }

    return this.#turnouts.map(turnout => `H ${turnout.id} ${turnout.address} ${turnout.subaddress} ${turnout.thrown}`)
  }

  /**
   * @param {*} turnout
   * @return {string}
   */
  addTurnout(turnout) {
    this.#turnouts = [...this.#turnouts, turnout]
    console.log(this.#turnouts);
    return '<O>';
  }

  /**
   * @param {string} turnoutId
   * @return {string}
   */
  removeTurnout(turnoutId) {
    this.#turnouts = this.#turnouts.filter(turnout => turnout.id !== turnoutId);
    console.log(this.#turnouts);
    return 'O';
  }
}

class Turnout {
  constructor(packet) {
    let [_key, id, address, subaddress] = removeControlCharacters(packet).split(" ");

    this.id = id;
    this.address = address;
    this.subaddress = subaddress;
    this.thrown = 0;
  }
}
