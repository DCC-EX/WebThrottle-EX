/*  This is part of the DCC++ EX Project for model railroading and more.
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
  const cleanedPacket = [...removeControlCharacters(packet)]
  return cleanedPacket.find(char => char !== " ");
}

class Emulator {
  constructor({logger}) {
    this.turnoutEmulator = new TurnoutEmulator()
    this.logger = logger
  }

  /**
   * @param {string} packet
   */
  write(packet) {
    if (packet === "<credits>") {
      console.log("Credits")
      return credits()
    }

    let packetKey = extractPacketKey(packet);

    switch (packetKey) {
      // Cab control
      case ("t"):
        this.logger('[RECEIVE] '+ this.#cabControlCommand(packet))
        break;

      // Track power off
      case ('0') :
        this.logger('[RECEIVE] '+ this.#powerOffCommand(packet));
        break;

      // Track power on
      case ('1'):
        this.logger('[RECEIVE] '+ this.#powerOnCommand(packet));
        break;

      // New cab functions
      case ('F'):
        this.logger('[RECEIVE] '+  this.#cabFunctionCommand(packet));
        break;

      // Legacy cab functions
      case ('f'):

        this.logger('[RECEIVE] '+  this.#cabFunctionCommand(packet, true));
        break;

      // Turnouts
      case ('T'): //Not fully finished
        this.logger('[RECEIVE] '+  this.#turnoutCommand(packet, this.turnoutEmulator))
        break

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
    return 'T 1 ' + splitPacket[3] + ' ' + splitPacket[4].substring(0, splitPacket[4].length - 2);
  }

  /**
   * @param {string} packet
   * @return {string}
   */
  #powerOffCommand(packet) {
    return 'p0';
  }

  /**
   * @param {string} packet
   * @return {string}
   */
  #powerOnCommand(packet) {
    return 'p1';
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
      return turnoutEmulator.addTurnout(new Turnout(packet))
    } else if (splitPacket.length === 2) {
      // Removes a Turnout
      return turnoutEmulator.removeTurnout(splitPacket[1])
    } else if (splitPacket.length === 1) {
      // Reads Turnouts
      return turnoutEmulator.turnouts
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
      return 'X'
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

    this.id = id
    this.address = address
    this.subaddress = subaddress
    this.thrown = 0
  }
}
