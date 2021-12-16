import {cabCommand} from 'https://cdn.skypack.dev/@cloudthrottle/dcc-ex--commands';

function sendCabCommand(fn, value) {
  setFunCurrentVal(fn, value);
  const cab = getCV()
  const func = fn.replace("f", "")
  const command = cabCommand({cab, func, value})
  writeRawToStream(command)
}

// This function will generate commands for each type of function
function generateFnCommand(clickedBtn) {
  const func = clickedBtn.getAttribute('name'); // Gives function name (F1, F2, .... F28)
  const btnPressed = clickedBtn.getAttribute("aria-pressed");
  const opr = btnPressed === "true" ? 1 : 0

  sendCabCommand(func, opr)
}

let timers = {}

function functionButtonPressed(buttonElement) {
  console.log("Pressed", buttonElement);
  const {dataset: {type: buttonType}} = buttonElement

  if (buttonType === "press") {
    timers[buttonElement.id] = setInterval(function () {
      // MOMENTARY HOLD ON
      buttonElement.setAttribute("aria-pressed", "true");
      generateFnCommand(buttonElement);
      console.debug("PRESSED HOLD ==> " + buttonElement.getAttribute("name"));
    }, 100);
  }
}

function functionButtonReleased(buttonElement) {
  clearInterval(timers[buttonElement.id]);
  console.log("Released", buttonElement);
  const {dataset: {type: buttonType}} = buttonElement
  const btnState = buttonElement.getAttribute("aria-pressed");

  if (buttonType === "press") {
    buttonElement.setAttribute("aria-pressed", "false");
    generateFnCommand(buttonElement);
    console.debug("RELEASED HOLD  ==> " + buttonElement.getAttribute("name"));
  } else {
    if (btnState === "false") {
      // TOGGLE ON
      buttonElement.setAttribute("aria-pressed", "true");
      generateFnCommand(buttonElement);
      console.debug("TOGGLE ON ==> " + buttonElement.getAttribute("name"));
    } else {
      // TOGGLE OFF
      buttonElement.setAttribute("aria-pressed", "false");
      generateFnCommand(buttonElement);
      console.debug("TOGGLE OFF ==> " + buttonElement.getAttribute("name"));
    }
  }
}

// Functions buttons
// Send Instructions to generate command depends the type of Button (press/toggle)
const fnWrapperElement = document.getElementById("fn-wrapper")

fnWrapperElement.addEventListener("mousedown", (event) => {
  const {target} = event
  if ([...target.classList].includes("fn-btn")) {
    functionButtonPressed(target)
  }
})
fnWrapperElement.addEventListener("mouseup", (event) => {
  const {target} = event
  if ([...target.classList].includes("fn-btn")) {
    functionButtonReleased(target)
  }
})
