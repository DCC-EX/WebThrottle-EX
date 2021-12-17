import {cabCommand} from 'https://cdn.skypack.dev/@cloudthrottle/dcc-ex--commands';

function sendCabCommand(fn, value) {
  setFunCurrentVal(fn, value);
  const cab = getCV()
  const func = fn.replace("f", "")
  const command = cabCommand({cab, func, value})
  writeRawToStream(command)
}

// This function will generate commands for each type of function
function generateFnCommand(funcName, btnPressed) {
  const value = btnPressed ? 1 : 0

  sendCabCommand(funcName, value)
}

function toggleButtonState(previousBtnState, buttonElement) {
  const newBtnState = !previousBtnState
  buttonElement.ariaPressed = newBtnState
  return newBtnState;
}

let buttonPressTimers = {}

function functionButtonPressed(buttonElement) {
  const {name, ariaPressed, dataset: {type: buttonType}} = buttonElement

  if (buttonType !== "press") {
    return
  }

  const newBtnState = toggleButtonState(ariaPressed, buttonElement);

  console.debug("PRESSED HOLD ==> " + name);
  generateFnCommand(name, newBtnState);

  buttonPressTimers[buttonElement.id] = setInterval(function () {
    // MOMENTARY HOLD ON
    console.debug("PRESSED HOLD ==> " + name);
    generateFnCommand(name, newBtnState);
  }, 100);
}

function functionButtonReleased(buttonElement) {
  clearInterval(buttonPressTimers[buttonElement.id]);
  const {name, ariaPressed, dataset: {type: buttonType}} = buttonElement
  const newBtnState = toggleButtonState(ariaPressed, buttonElement);

  if (buttonType === "press") {
    console.debug("RELEASED HOLD  ==> " + name);
  } else {
    const action = newBtnState ? "ON" : "OFF"
    console.debug(`TOGGLE ${action} ==> ` + name);
  }

  generateFnCommand(name, newBtnState);
}

// Functions buttons
// Send Instructions to generate command depends the type of Button (press/toggle)
const fnWrapperElement = document.getElementById("fn-wrapper")

fnWrapperElement.addEventListener("mousedown", (event) => {
  const {target} = event
  if (isFunctionButton(target)) {
    functionButtonPressed(target)
  }
})
fnWrapperElement.addEventListener("mouseup", (event) => {
  const {target} = event
  if (isFunctionButton(target)) {
    functionButtonReleased(target)
  }
})

function isFunctionButton(target) {
  return [...target.classList].includes("fn-btn");
}
