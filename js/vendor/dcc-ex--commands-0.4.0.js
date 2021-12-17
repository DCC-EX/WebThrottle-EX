// src/types/index.ts
var ParserStatus = /* @__PURE__ */ ((ParserStatus2) => {
  ParserStatus2["SUCCESS"] = "success";
  return ParserStatus2;
})(ParserStatus || {});

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
function parseCommand(command) {
  const cleanedParams = removeControlCharacters(command);
  const [key, ...attributes] = cleanedParams.split(" ");
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

// src/parsers/eeproms/eraseParser.ts
var eraseParserKey = "0";
var eraseParser = ({ key }) => {
  if (key !== eraseParserKey) {
    throw new ParserKeyError("eraseParser", key);
  }
  return {
    key: eraseParserKey,
    status: ParserStatus.SUCCESS,
    params: {}
  };
};

// src/parsers/eeproms/storeParser.ts
var storeParserKey = "e";
var storeParser = ({ key, attributes }) => {
  if (key !== storeParserKey) {
    throw new ParserKeyError("storeParser", key);
  }
  return {
    key: storeParserKey,
    status: ParserStatus.SUCCESS,
    params: {}
  };
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
var powerParser = ({ key: potentialKey, attributes }) => {
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
export {
  Direction,
  ParserKeyError,
  ParserStatus,
  ReturnTrack,
  Track,
  TransitionProfile,
  TurnoutState,
  accessoryCommand,
  cabCommand,
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
  forgetAllCabsCommand,
  forgetCabCommand,
  isControlCharacters,
  listSensorsCommand,
  listSensorsStatusCommand,
  listTurnoutsCommand,
  makeCommand,
  makeCommandFromAttributes,
  parseAddress,
  parseCommand,
  powerCommand,
  powerParser,
  powerParserKey,
  readAddressProgrammingCommand,
  readCVByteProgrammingCommand,
  removeControlCharacters,
  storeCommand,
  storeParser,
  storeParserKey,
  throttleCommand,
  turnoutCommand,
  verifyCVBitProgrammingCommand,
  verifyCVByteProgrammingCommand,
  writeAddressProgrammingCommand,
  writeCVBitMainCommand,
  writeCVBitProgrammingCommand,
  writeCVByteMainCommand,
  writeCVByteProgrammingCommand
};
//# sourceMappingURL=dcc-ex--commands-0.4.0.js.map
