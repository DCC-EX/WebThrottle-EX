import {cabCommand} from 'https://cdn.skypack.dev/@cloudthrottle/dcc-ex--commands';

function sendCabCommand(fn, value) {
  setFunCurrentVal(fn,value);
  const cab = getCV()
  const func = fn.replace("f", "")
  const command = cabCommand({cab, func, value})
  writeRawToStream(command)
}

// This function will generate commands for each type of function
function generateFnCommand(clickedBtn) {
  const func = clickedBtn.attr('name'); // Gives function name (F1, F2, .... F28)
  const btnPressed = clickedBtn.attr("aria-pressed");
  const opr = btnPressed==="true" ? 1: 0

  sendCabCommand(func, opr)
}

// Functions buttons
// Send Instructions to generate command depends the type of Button (press/toggle)
var timer = 0;
$(document)
  .on("mousedown", ".fn-btn", function () {
    const clickedBtn = $(this);
    const btnType = clickedBtn.data("type");
    if (btnType === "press") {
      timer = setInterval(function () {
        // MOMENTARY HOLD ON
        clickedBtn.attr("aria-pressed", "true");
        generateFnCommand(clickedBtn);
        console.debug("PRESSED HOLD ==> " + clickedBtn.attr("name"));
      }, 100);
    }
  })
  .on("mouseup mouserelease", ".fn-btn", function () {
    clearInterval(timer);
    const clickedBtn = $(this);
    const btnType = clickedBtn.data("type");
    const btnState = clickedBtn.attr("aria-pressed");
    if (btnType === "press") {
      // MOMENTARY HOLD OFF
      clickedBtn.attr("aria-pressed", "false");
      generateFnCommand(clickedBtn);
      console.debug("RELEASED HOLD  ==> " + clickedBtn.attr("name"));
    } else {
      if (btnState === "false") {
        // TOGGLE ON
        clickedBtn.attr("aria-pressed", "true");
        generateFnCommand(clickedBtn);
        console.debug("TOGGLE ON ==> " + clickedBtn.attr("name"));
      } else {
        // TOGGLE OFF
        clickedBtn.attr("aria-pressed", "false");
        generateFnCommand(clickedBtn);
        console.debug("TOGGLE OFF ==> " + clickedBtn.attr("name"));
      }
    }
  });
