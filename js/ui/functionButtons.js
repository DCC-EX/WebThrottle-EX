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

let buttonPressTimers = {}

function toggleButtonState(previousBtnState, buttonElement) {
  const newBtnState = previousBtnState === "false"
  buttonElement.setAttribute("aria-pressed", newBtnState);
  return newBtnState;
}

function functionButtonPressed(buttonElement) {
  const {dataset: {type: buttonType}} = buttonElement

  if (buttonType !== "press") {
    return
  }

  const buttonName = buttonElement.getAttribute("name")
  const previousBtnState = buttonElement.getAttribute("aria-pressed");
  const newBtnState = toggleButtonState(previousBtnState, buttonElement);

  console.debug("PRESSED HOLD ==> " + buttonName);
  generateFnCommand(buttonName, newBtnState);

  buttonPressTimers[buttonElement.id] = setInterval(function () {
    // MOMENTARY HOLD ON
    console.debug("PRESSED HOLD ==> " + buttonName);
    generateFnCommand(buttonName, newBtnState);
  }, 100);
}

function functionButtonReleased(buttonElement) {
  clearInterval(buttonPressTimers[buttonElement.id]);
  const {dataset: {type: buttonType}} = buttonElement
  const buttonName = buttonElement.getAttribute("name")
  const previousBtnState = buttonElement.getAttribute("aria-pressed");
  const newBtnState = toggleButtonState(previousBtnState, buttonElement);

  if (buttonType === "press") {
    console.debug("RELEASED HOLD  ==> " + buttonName);
  } else {
    const action = newBtnState ? "ON" : "OFF"
    console.debug(`TOGGLE ${action} ==> ` + buttonName);
  }

  generateFnCommand(buttonName, newBtnState);
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
