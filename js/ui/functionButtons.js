// Function to generate commands for functions F0 to F4
function sendCommandForF0ToF4(fn, opr){
  setFunCurrentVal(fn,opr);
  const cabval = (128+getFunCurrentVal("f1")*1 + getFunCurrentVal("f2")*2 + getFunCurrentVal("f3")*4  + getFunCurrentVal("f4")*8 + getFunCurrentVal("f0")*16);
  writeToStream("f "+getCV()+" "+cabval);
  console.log("Command: "+ "f "+getCV()+" "+cabval);

}

// Function to generate commands for functions F5 to F8
function sendCommandForF5ToF8(fn, opr){
  setFunCurrentVal(fn,opr);
  const cabval = (176+getFunCurrentVal("f5")*1 + getFunCurrentVal("f6")*2 + getFunCurrentVal("f7")*4  + getFunCurrentVal("f8")*8);
  writeToStream("f "+getCV()+" "+cabval);
  console.log("Command: "+ "f "+getCV()+" "+cabval);

}

// Function to generate commands for functions F9 to F12
function sendCommandForF9ToF12(fn, opr){
  setFunCurrentVal(fn,opr);
  const cabval = (160+getFunCurrentVal("f9")*1 + getFunCurrentVal("f10")*2 + getFunCurrentVal("f11")*4  + getFunCurrentVal("f12")*8);
  writeToStream("f "+getCV()+" "+cabval);
  console.log("Command: "+ "f "+getCV()+" "+cabval);

}

// Function to generate commands for functions F13 to F20
function sendCommandForF13ToF20(fn, opr){
  setFunCurrentVal(fn,opr);
  const cabval = (getFunCurrentVal("f13")*1 + getFunCurrentVal("f14")*2 + getFunCurrentVal("f15")*4  + getFunCurrentVal("f16")*8 + getFunCurrentVal("f17")*16 + getFunCurrentVal("f18")*32 + getFunCurrentVal("f19")*64 + getFunCurrentVal("f20")*128);
  writeToStream("f "+getCV()+" 222 "+cabval);
  console.log("Command: "+ "f "+getCV()+" 222 "+cabval);

}

// Function to generate commands for functions F21 to F28
function sendCommandForF21ToF28(fn, opr){
  setFunCurrentVal(fn,opr);
  const cabval = (getFunCurrentVal("f21")*1 + getFunCurrentVal("f22")*2 + getFunCurrentVal("f23")*4  + getFunCurrentVal("f24")*8 + getFunCurrentVal("f25")*16 + getFunCurrentVal("f26")*32 + getFunCurrentVal("f27")*64 + getFunCurrentVal("f28")*128);
  writeToStream("f "+getCV()+" 223 "+cabval);
  console.log("Command: "+ "f "+getCV()+" 223 "+cabval);

}

// This function will generate commands for each type of function
function generateFnCommand(clickedBtn) {

  const func = clickedBtn.attr('name'); // Gives function name (F1, F2, .... F28)
  const btnPressed = clickedBtn.attr("aria-pressed");
  const opr = btnPressed==="true" ? 1: 0

  switch(func){
    case "f0":
    case "f1":
    case "f2":
    case "f3":
    case "f4":
    {
      sendCommandForF0ToF4(func,opr);
      break;
    }
    case "f5":
    case "f6":
    case "f7":
    case "f8":
    {
      sendCommandForF5ToF8(func,opr);
      break;
    }
    case "f9":
    case "f10":
    case "f11":
    case "f12":
    {
      sendCommandForF9ToF12(func,opr);
      break;
    }
    case "f13":
    case "f14":
    case "f15":
    case "f16":
    case "f17":
    case "f18":
    case "f19":
    case "f20":
    {
      sendCommandForF13ToF20(func,opr);
      break;
    }
    case "f21":
    case "f22":
    case "f23":
    case "f24":
    case "f25":
    case "f26":
    case "f27":
    case "f28":
    {
      sendCommandForF21ToF28(func,opr);
      break;
    }
    default:
    {
      alert("Invalid Function");
    }

  }
}

// Functions buttons
// Send Instructions to generate command depends the type of Button (press/toggle)
var timer = 0;
$(document)
  .on("mousedown", ".fn-btn", function () {
    console.log($(this).val);
    const clickedBtn = $(this);
    const btnType = clickedBtn.data("type");
    if (btnType === "press") {
      timer = setInterval(function () {
        // MOMENTARY HOLD ON
        clickedBtn.attr("aria-pressed", "true");
        generateFnCommand(clickedBtn);
        console.log("PRESSED HOLD ==> " + clickedBtn.attr("name"));
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
      console.log("RELEASED HOLD  ==> " + clickedBtn.attr("name"));
    } else {
      if (btnState === "false") {
        // TOGGLE ON
        clickedBtn.attr("aria-pressed", "true");
        generateFnCommand(clickedBtn);
        console.log("TOGGLE ON ==> " + clickedBtn.attr("name"));
      } else {
        // TOGGLE OFF
        clickedBtn.attr("aria-pressed", "false");
        generateFnCommand(clickedBtn);
        console.log("TOGGLE OFF ==> " + clickedBtn.attr("name"));
      }
    }
  });
