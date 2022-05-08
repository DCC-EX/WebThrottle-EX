// src/types/FunctionButtons.ts
var FunctionButtonKind = /* @__PURE__ */ ((FunctionButtonKind2) => {
  FunctionButtonKind2["TOGGLE"] = "toggle";
  FunctionButtonKind2["PRESS"] = "press";
  return FunctionButtonKind2;
})(FunctionButtonKind || {});

// src/types/index.ts
var Enabled = /* @__PURE__ */ ((Enabled2) => {
  Enabled2["OFF"] = "OFF";
  Enabled2["ON"] = "ON";
  return Enabled2;
})(Enabled || {});
var ParserStatus = /* @__PURE__ */ ((ParserStatus2) => {
  ParserStatus2["SUCCESS"] = "success";
  return ParserStatus2;
})(ParserStatus || {});
var FunctionName = /* @__PURE__ */ ((FunctionName2) => {
  FunctionName2["EEPROMS_ERASE"] = "eraseParser";
  FunctionName2["EEPROMS_STORE"] = "storeParser";
  FunctionName2["LOCO"] = "locoParser";
  FunctionName2["POWER"] = "powerParser";
  FunctionName2["ROSTER_ITEM"] = "rosterItemParser";
  FunctionName2["THROTTLE"] = "throttleParser";
  return FunctionName2;
})(FunctionName || {});

// src/utils/makeCommand.ts
var makeCommand = (instruction) => {
  return `<${instruction}>`;
};
var makeCommandFromAttributes = (attributes) => {
  const str = attributes.map((attribute) => {
    if (typeof attribute === "number") {
      return attribute.toString();
    }
    return attribute;
  }).filter((attribute) => !isBlank(attribute)).join(" ");
  return makeCommand(str);
};
function isBlank(param) {
  if (typeof param === "string") {
    return param.trim() === "";
  }
  return true;
}

// src/utils/parseAddress.ts
var parseAddress = (address) => {
  let linearAddress = null;
  let primaryAddress = null;
  let subAddress = null;
  if (typeof address === "number") {
    linearAddress = address;
  } else {
    primaryAddress = address.primaryAddress;
    subAddress = address.subAddress;
  }
  return { linearAddress, primaryAddress, subAddress };
};

// src/utils/parseCommand.ts
function isControlCharacters(char) {
  return ["<", ">"].includes(char);
}
function removeControlCharacters(command) {
  return command.split("").filter((char) => !isControlCharacters(char)).join("");
}
function splitBySpaceOrQuote(cleanedParams) {
  const parts = cleanedParams.match(/\w+|"[^"]+"/g);
  return parts ?? [];
}
function getStrings(cleanedParams) {
  return splitBySpaceOrQuote(cleanedParams).map((part) => {
    return part.replaceAll('"', "");
  });
}
function parseCommand(command) {
  const cleanedParams = removeControlCharacters(command);
  const [key, ...attributes] = getStrings(cleanedParams);
  return {
    key,
    attributes
  };
}

// src/commands/accessories/accessoryCommand.ts
var accessorySendKey = "a";
var accessoryCommand = ({ address, active }) => {
  const { linearAddress, primaryAddress, subAddress } = parseAddress(address);
  const addressSend = linearAddress ?? [primaryAddress, subAddress].join(" ");
  const attributes = [
    accessorySendKey,
    addressSend,
    active
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/cabs/cabCommand.ts
var cabSendKey = "F";
var cabCommand = ({ cab, func, value }) => {
  const attributes = [
    cabSendKey,
    cab,
    func,
    value
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/cabs/forgetCabCommand.ts
var forgetCabCommandKey = "-";
var forgetCabCommand = ({ cab }) => {
  const attributes = [
    forgetCabCommandKey,
    cab
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/cabs/forgetAllCabsCommand.ts
var forgetAllCabsCommandKey = "-";
var forgetAllCabsCommand = () => {
  return makeCommand(forgetAllCabsCommandKey);
};

// src/commands/decoders/writeCVByteMainCommand.ts
var writeMainDecoderByteKey = "w";
var writeCVByteMainCommand = ({ cab, cv, value }) => {
  const attributes = [
    writeMainDecoderByteKey,
    cab,
    cv,
    value
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/decoders/writeCVBitMainCommand.ts
var writeMainDecoderBitKey = "b";
var writeCVBitMainCommand = function({ cab, cv, bit, value }) {
  const attributes = [
    writeMainDecoderBitKey,
    cab,
    cv,
    bit,
    value
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/decoders/writeAddressProgrammingCommand.ts
var writeDecoderAddressKey = "W";
var writeAddressProgrammingCommand = ({ address }) => {
  const attributes = [
    writeDecoderAddressKey,
    address
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/decoders/writeCVByteProgrammingCommand.ts
var writeProgrammingDecoderByteKey = "W";
var writeCVByteProgrammingCommand = ({
  cv,
  value,
  callbackNum,
  callbackSub
}) => {
  const attributes = [
    writeProgrammingDecoderByteKey,
    cv,
    value,
    callbackNum,
    callbackSub
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/decoders/writeCVBitProgrammingCommand.ts
var writeProgrammingDecoderBitKey = "B";
var writeCVBitProgrammingCommand = ({
  cv,
  bit,
  value,
  callbackNum,
  callbackSub
}) => {
  const attributes = [
    writeProgrammingDecoderBitKey,
    cv,
    bit,
    value,
    callbackNum,
    callbackSub
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/decoders/readCVByteProgrammingCommand.ts
var readProgrammingDecoderByteKey = "R";
var readCVByteProgrammingCommand = ({
  cv,
  callbackNum,
  callbackSub
}) => {
  const attributes = [
    readProgrammingDecoderByteKey,
    cv,
    callbackNum,
    callbackSub
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/decoders/readAddressProgrammingCommand.ts
var readProgrammingDecoderAddressKey = "R";
var readAddressProgrammingCommand = () => makeCommand(readProgrammingDecoderAddressKey);

// src/commands/decoders/verifyCVByteProgrammingCommand.ts
var verifyProgrammingDecoderByteKey = "V";
var verifyCVByteProgrammingCommand = ({
  cv,
  byteValue
}) => {
  const attributes = [
    verifyProgrammingDecoderByteKey,
    cv,
    byteValue
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/decoders/verifyCVBitProgrammingCommand.ts
var verifyProgrammingDecoderBitKey = "V";
var verifyCVBitProgrammingCommand = ({
  cv,
  bit,
  bitValue
}) => {
  const attributes = [
    verifyProgrammingDecoderBitKey,
    cv,
    bit,
    bitValue
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/diagnostics/diagnosticCabsCommand.ts
var diagnosticCabsCommandKey = "D";
var diagnosticCabsCommand = () => {
  const constant = "CABS";
  const attributes = [
    diagnosticCabsCommandKey,
    constant
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/diagnostics/diagnosticRAMCommand.ts
var diagnosticRAMCommandKey = "D";
var diagnosticRAMCommand = () => {
  const constant = "RAM";
  const attributes = [
    diagnosticRAMCommandKey,
    constant
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/diagnostics/diagnosticAckCommand.ts
var diagnosticAckCommandKey = "D";
var diagnosticAckCommand = ({ enable }) => {
  const constant = "ACK";
  const attributes = [
    diagnosticAckCommandKey,
    constant,
    enable
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/diagnostics/diagnosticParserCommand.ts
var diagnosticParserCommandKey = "D";
var diagnosticParserCommand = ({ enable }) => {
  const constant = "CMD";
  const attributes = [
    diagnosticParserCommandKey,
    constant,
    enable
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/diagnostics/diagnosticWiFiCommand.ts
var diagnosticWiFiCommandKey = "D";
var diagnosticWiFiCommand = ({ enable }) => {
  const constant = "WIFI";
  const attributes = [
    diagnosticWiFiCommandKey,
    constant,
    enable
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/diagnostics/diagnosticWiThrottleCommand.ts
var diagnosticWiThrottleCommandKey = "D";
var diagnosticWiThrottleCommand = ({ enable }) => {
  const constant = "WIT";
  const attributes = [
    diagnosticWiThrottleCommandKey,
    constant,
    enable
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/eeproms/storeCommand.ts
var storeCommandKey = "E";
var storeCommand = () => makeCommand(storeCommandKey);

// src/commands/eeproms/eraseCommand.ts
var eraseCommandKey = "e";
var eraseCommand = () => makeCommand(eraseCommandKey);

// src/commands/exRails/exRailFreeBlockCommand.ts
var exRailFreeBlockCommand = ({ blockId }) => {
  const constant = "/ FREE";
  const attributes = [
    constant,
    blockId
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/exRails/exRailKillTaskCommand.ts
var exRailKillTaskCommand = ({ taskId }) => {
  const constant = "/ KILL";
  const attributes = [
    constant,
    taskId
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/exRails/exRailLatchSensorCommand.ts
var exRailLatchSensorCommand = ({ sensorId }) => {
  const constant = "/ LATCH";
  const attributes = [
    constant,
    sensorId
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/exRails/exRailPauseCommand.ts
var exRailPauseCommand = () => makeCommand("/ PAUSE");

// src/commands/exRails/exRailReserveBlockCommand.ts
var exRailReserveBlockCommand = ({ blockId }) => {
  const constant = "/ RESERVE";
  const attributes = [
    constant,
    blockId
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/exRails/exRailResumeCommand.ts
var exRailResumeCommand = () => makeCommand("/ RESUME");

// src/commands/exRails/exRailRoutesCommand.ts
var exRailRoutesCommand = () => makeCommand("/ ROUTES");

// src/commands/exRails/exRailStartTaskCommand.ts
var exRailStartTaskCommand = ({ address, taskId }) => {
  const constant = "/ START";
  const attributes = [
    constant,
    address,
    taskId
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/exRails/exRailTasksCommand.ts
var exRailTasksCommand = () => makeCommand("/");

// src/commands/exRails/exRailUnlatchSensorCommand.ts
var exRailUnlatchSensorCommand = ({ sensorId }) => {
  const constant = "/ UNLATCH";
  const attributes = [
    constant,
    sensorId
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/powers/powerCommand.ts
var Track = /* @__PURE__ */ ((Track2) => {
  Track2["MAIN"] = "MAIN";
  Track2["PROG"] = "PROG";
  Track2["JOIN"] = "JOIN";
  return Track2;
})(Track || {});
var powerCommand = ({ power, track }) => {
  const attributes = [
    power,
    track
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/rosters/rosterCommand.ts
var rosterSendKey = "J";
var rosterCommand = ({ cabId } = {}) => {
  return makeCommandFromAttributes([rosterSendKey, cabId]);
};

// src/commands/sensors/defineSensorCommand.ts
var defineSensorCommandKey = "S";
var defineSensorCommand = ({ sensor, pin, pullUp }) => {
  const attributes = [
    defineSensorCommandKey,
    sensor,
    pin,
    pullUp
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/sensors/deleteSensorCommand.ts
var deleteSensorCommandKey = "S";
var deleteSensorCommand = ({ sensor }) => {
  const attributes = [
    deleteSensorCommandKey,
    sensor
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/sensors/listSensorsCommand.ts
var listSensorsCommandKey = "S";
var listSensorsCommand = () => makeCommand(listSensorsCommandKey);

// src/commands/sensors/listSensorsStatusCommand.ts
var listSensorsStatusCommandKey = "Q";
var listSensorsStatusCommand = () => makeCommand(listSensorsStatusCommandKey);

// src/commands/throttles/throttleCommand.ts
var Direction = /* @__PURE__ */ ((Direction2) => {
  Direction2[Direction2["REVERSE"] = 0] = "REVERSE";
  Direction2[Direction2["FORWARD"] = 1] = "FORWARD";
  return Direction2;
})(Direction || {});
var throttleCommandKey = "t";
var throttleCommand = ({ cab, speed, direction }) => {
  const legacyAttribute = 1;
  const attributes = [
    throttleCommandKey,
    legacyAttribute,
    cab,
    speed,
    direction
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/throttles/emergencyStopCommand.ts
var emergencyStopCommandKey = "!";
var emergencyStopCommand = () => {
  return makeCommand(emergencyStopCommandKey);
};

// src/commands/turnouts/turnoutCommand.ts
var TurnoutState = /* @__PURE__ */ ((TurnoutState2) => {
  TurnoutState2[TurnoutState2["CLOSED"] = 0] = "CLOSED";
  TurnoutState2[TurnoutState2["THROWN"] = 1] = "THROWN";
  return TurnoutState2;
})(TurnoutState || {});
var turnoutCommandKey = "T";
var turnoutCommand = ({ turnout, thrown }) => {
  const attributes = [
    turnoutCommandKey,
    turnout,
    thrown
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/turnouts/defineDCCTurnoutCommand.ts
var defineDCCTurnoutCommandKey = "T";
var defineDCCTurnoutCommand = function({
  turnout,
  address
}) {
  const constant = "DCC";
  const { linearAddress, primaryAddress, subAddress } = parseAddress(address);
  const addressSend = linearAddress ?? [primaryAddress, subAddress].join(" ");
  const attributes = [
    defineDCCTurnoutCommandKey,
    turnout,
    constant,
    addressSend
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/turnouts/defineServoTurnoutCommand.ts
var TransitionProfile = /* @__PURE__ */ ((TransitionProfile2) => {
  TransitionProfile2[TransitionProfile2["IMMEDIATE"] = 0] = "IMMEDIATE";
  TransitionProfile2[TransitionProfile2["FAST"] = 1] = "FAST";
  TransitionProfile2[TransitionProfile2["MEDIUM"] = 2] = "MEDIUM";
  TransitionProfile2[TransitionProfile2["SLOW"] = 3] = "SLOW";
  TransitionProfile2[TransitionProfile2["BOUNCE"] = 4] = "BOUNCE";
  return TransitionProfile2;
})(TransitionProfile || {});
var defineServoTurnoutCommandKey = "T";
var defineServoTurnoutCommand = ({
  turnout,
  pin,
  thrownPosition,
  closedPosition,
  profile
}) => {
  const constant = "SERVO";
  const attributes = [
    defineServoTurnoutCommandKey,
    turnout,
    constant,
    pin,
    thrownPosition,
    closedPosition,
    profile
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/turnouts/defineVPINTurnoutCommand.ts
var defineVPINTurnoutCommandKey = "T";
var defineVPINTurnoutCommand = ({ turnout, pin }) => {
  const constant = "VPIN";
  const attributes = [
    defineVPINTurnoutCommandKey,
    turnout,
    constant,
    pin
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/turnouts/deleteTurnoutCommand.ts
var deleteTurnoutCommandKey = "T";
var deleteTurnoutCommand = ({ turnout }) => {
  const attributes = [
    deleteTurnoutCommandKey,
    turnout
  ];
  return makeCommandFromAttributes(attributes);
};

// src/commands/turnouts/listTurnoutsCommand.ts
var listTurnoutsCommandKey = "T";
var listTurnoutsCommand = () => makeCommand(listTurnoutsCommandKey);

// src/parsers/errors/parserKeyError.ts
var ParserKeyError = class extends Error {
  constructor(parser, key) {
    const message = `${parser} can not parse the key '${key}'`;
    super(message);
    this.name = "ParserKeyError";
  }
};
var ParserAttributeError = class extends Error {
  constructor(attribute, value, msg) {
    const message = `${attribute} set to ${value}. ${msg}`;
    super(message);
    this.name = "ParserAttributeError";
  }
};

// src/parsers/eeproms/eraseParser.ts
var eraseParserKey = "0";
var parseFromCommand = ({ key }) => {
  if (key !== eraseParserKey) {
    throw new ParserKeyError("eraseParser", key);
  }
  return {
    key: eraseParserKey,
    parser: FunctionName.EEPROMS_ERASE,
    status: ParserStatus.SUCCESS,
    params: {}
  };
};
var eraseParser = (command) => {
  const commandParams = parseCommand(command);
  return parseFromCommand(commandParams);
};

// src/parsers/eeproms/storeParser.ts
var storeParserKey = "e";
var parseFromCommand2 = ({ key, attributes }) => {
  if (key !== storeParserKey) {
    throw new ParserKeyError("storeParser", key);
  }
  return {
    key: storeParserKey,
    parser: FunctionName.EEPROMS_STORE,
    status: ParserStatus.SUCCESS,
    params: {}
  };
};
var storeParser = (command) => {
  const commandParams = parseCommand(command);
  return parseFromCommand2(commandParams);
};

// src/parsers/powers/powerParser.ts
var ReturnTrack = /* @__PURE__ */ ((ReturnTrack2) => {
  ReturnTrack2["ALL"] = "ALL";
  ReturnTrack2["MAIN"] = "MAIN";
  ReturnTrack2["PROG"] = "PROG";
  ReturnTrack2["JOIN"] = "JOIN";
  return ReturnTrack2;
})(ReturnTrack || {});
var powerParserKey = "p";
var parseFromCommand3 = ({ key: potentialKey, attributes }) => {
  const [key, power] = potentialKey.split("");
  if (!isPowerCommand(key, power)) {
    throw new ParserKeyError("powerParser", key);
  }
  let [track] = attributes;
  if (!Object.values(ReturnTrack).includes(track)) {
    track = "ALL" /* ALL */;
  }
  return {
    key: powerParserKey,
    parser: FunctionName.POWER,
    status: ParserStatus.SUCCESS,
    params: {
      power: parseInt(power),
      track
    }
  };
};
function isPowerCommand(key, power) {
  return key === powerParserKey && ["0", "1"].includes(power);
}
var powerParser = (command) => {
  const commandParams = parseCommand(command);
  return parseFromCommand3(commandParams);
};

// src/parsers/throttles/throttleParser.ts
var throttleParserKey = "T";
var isValidDirection = (direction) => !Object.values(Direction).includes(direction);
var parseFromCommand4 = ({ key, attributes }) => {
  const [register, speed, directionString] = attributes;
  if (key !== throttleParserKey) {
    throw new ParserKeyError("throttleParser", key);
  }
  const direction = parseInt(directionString);
  if (isValidDirection(direction)) {
    throw new ParserAttributeError("direction", direction, `it must be one of ${Object.values(Direction).join(" | ")}`);
  }
  return {
    key: throttleParserKey,
    parser: FunctionName.THROTTLE,
    status: ParserStatus.SUCCESS,
    params: {
      register: parseInt(register),
      speed: parseInt(speed),
      direction
    }
  };
};
var throttleParser = (command) => {
  const commandParams = parseCommand(command);
  return parseFromCommand4(commandParams);
};

// src/parsers/throttles/locoParser.ts
function parseSpeedAndDirection(speedValue) {
  const direction = speedValue - 128 >= 0 ? Direction.FORWARD : Direction.REVERSE;
  const normalisedSpeed = speedValue - 128 >= 0 ? speedValue - 128 : speedValue;
  let speed;
  switch (normalisedSpeed) {
    case 0: {
      speed = 0;
      break;
    }
    case 1: {
      speed = -1;
      break;
    }
    default: {
      speed = normalisedSpeed - 1;
    }
  }
  return {
    speed,
    direction
  };
}
var parseFunctionButtons = (functionButtonValue) => {
  const values = functionButtonValue.toString(2).split("").reverse().map((value) => parseInt(value));
  const numOfFunctions = 29;
  return Array.from(Array(numOfFunctions)).reduce((acc, currentValue, index) => {
    acc[index] = {
      value: values[index] ?? 0
    };
    return acc;
  }, {});
};
var locoParserKey = "l";
var parseFromCommand5 = ({ key, attributes }) => {
  const [cabIdValue, registerValue, speedValue, functionButtonsValue] = attributes;
  if (key !== locoParserKey) {
    throw new ParserKeyError("locoParser", key);
  }
  const { speed, direction } = parseSpeedAndDirection(parseInt(speedValue));
  const functionButtons = parseFunctionButtons(parseInt(functionButtonsValue));
  return {
    key: locoParserKey,
    parser: FunctionName.LOCO,
    status: ParserStatus.SUCCESS,
    params: {
      register: parseInt(registerValue),
      speed,
      direction,
      cabId: parseInt(cabIdValue),
      functionButtons
    }
  };
};
var locoParser = (command) => {
  const commandParams = parseCommand(command);
  return parseFromCommand5(commandParams);
};

// src/parsers/rosters/rosterItemParser.ts
var rosterItemParserKey = "j";
var functionButtonsParser = (param = null) => {
  if (param === null) {
    return {};
  }
  const buttons = param.split("/");
  return buttons.reduce((accum, button, index) => {
    const [display, isPress] = button.split(/(\*)/).reverse();
    const kind = isPress == null && !isPress ? FunctionButtonKind.TOGGLE : FunctionButtonKind.PRESS;
    accum[index] = {
      display,
      kind
    };
    return accum;
  }, {});
};
var parseFromCommand6 = ({ key, attributes }) => {
  const [cabId, display, rawFunctionButtons] = attributes;
  if (key !== rosterItemParserKey) {
    throw new ParserKeyError("rosterItemParser", key);
  }
  const functionButtons = functionButtonsParser(rawFunctionButtons);
  return {
    key: rosterItemParserKey,
    parser: FunctionName.ROSTER_ITEM,
    status: ParserStatus.SUCCESS,
    params: {
      cabId: parseInt(cabId),
      display,
      functionButtons
    }
  };
};
var rosterItemParser = (command) => {
  const commandParams = parseCommand(command);
  return parseFromCommand6(commandParams);
};

// src/parsers/genericParser.ts
var createParser = (parsers) => {
  return {
    parse: async (command) => {
      const results = parsers.map(async (parser) => {
        return await new Promise((resolve, reject) => {
          try {
            const result = parser(command);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      });
      return await Promise.any(results);
    }
  };
};
var genericParser = () => {
  const allParsers = [
    eraseParser,
    locoParser,
    powerParser,
    rosterItemParser,
    storeParser,
    throttleParser
  ];
  return createParser(allParsers);
};
export {
  Direction,
  Enabled,
  FunctionButtonKind,
  FunctionName,
  ParserAttributeError,
  ParserKeyError,
  ParserStatus,
  ReturnTrack,
  Track,
  TransitionProfile,
  TurnoutState,
  accessoryCommand,
  cabCommand,
  createParser,
  defineDCCTurnoutCommand,
  defineSensorCommand,
  defineServoTurnoutCommand,
  defineVPINTurnoutCommand,
  deleteSensorCommand,
  deleteTurnoutCommand,
  diagnosticAckCommand,
  diagnosticCabsCommand,
  diagnosticParserCommand,
  diagnosticRAMCommand,
  diagnosticWiFiCommand,
  diagnosticWiThrottleCommand,
  emergencyStopCommand,
  eraseCommand,
  eraseParser,
  eraseParserKey,
  exRailFreeBlockCommand,
  exRailKillTaskCommand,
  exRailLatchSensorCommand,
  exRailPauseCommand,
  exRailReserveBlockCommand,
  exRailResumeCommand,
  exRailRoutesCommand,
  exRailStartTaskCommand,
  exRailTasksCommand,
  exRailUnlatchSensorCommand,
  forgetAllCabsCommand,
  forgetCabCommand,
  genericParser,
  isControlCharacters,
  listSensorsCommand,
  listSensorsStatusCommand,
  listTurnoutsCommand,
  locoParser,
  makeCommand,
  makeCommandFromAttributes,
  parseAddress,
  parseCommand,
  parseFromCommand3 as parseFromCommand,
  parseFunctionButtons,
  parseSpeedAndDirection,
  powerCommand,
  powerParser,
  powerParserKey,
  readAddressProgrammingCommand,
  readCVByteProgrammingCommand,
  removeControlCharacters,
  rosterCommand,
  rosterItemParser,
  storeCommand,
  storeParser,
  storeParserKey,
  throttleCommand,
  throttleParser,
  turnoutCommand,
  verifyCVBitProgrammingCommand,
  verifyCVByteProgrammingCommand,
  writeAddressProgrammingCommand,
  writeCVBitMainCommand,
  writeCVBitProgrammingCommand,
  writeCVByteMainCommand,
  writeCVByteProgrammingCommand
};
//# sourceMappingURL=dcc-ex--commands-0.10.0.js.map
