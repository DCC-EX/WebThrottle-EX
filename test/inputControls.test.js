const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function createHarness() {
  const elements = {};
  const clicked = [];
  const handlers = {};
  let frame = null;
  const gamepad = {
    axes: [0, 0],
    buttons: Array.from({ length: 16 }, () => ({ pressed: false })),
  };

  function createControl(selector, tagName = "BUTTON") {
    const control = {
      tagName,
      disabled: false,
      className: "",
      click() {
        clicked.push(selector);
      },
    };
    elements[selector] = control;
    return control;
  }

  createControl("#button-right");
  createControl("#button-left");
  createControl("#dir-f");
  createControl("#dir-b");
  createControl("#normal-stop");
  createControl("#emergency-stop");
  const textEntry = createControl("#loco-input", "INPUT");

  const document = {
    body: {
      appendChild(element) {
        elements[`#${element.id}`] = element;
      },
    },
    createElement(tagName) {
      return {
        tagName: tagName.toUpperCase(),
        id: "",
        className: "",
        textContent: "",
        attributes: {},
        setAttribute(name, value) {
          this.attributes[name] = String(value);
        },
        getAttribute(name) {
          return this.attributes[name] ?? null;
        },
      };
    },
    querySelector(selector) {
      return elements[selector] || null;
    },
    getElementById(id) {
      return elements[`#${id}`] || null;
    },
  };

  function jquery(value) {
    if (typeof value === "function") {
      value();
      return undefined;
    }

    return {
      hasClass(name) {
        return (value.className || "").split(/\s+/).includes(name);
      },
      on(eventName, callback) {
        handlers[eventName] = callback;
        return this;
      },
    };
  }

  const window = {
    addEventListener(eventName, callback) {
      handlers[eventName] = callback;
    },
    requestAnimationFrame(callback) {
      frame = callback;
      return 1;
    },
    cancelAnimationFrame() {
      frame = null;
    },
    jQuery: jquery,
  };

  const navigator = {
    getGamepads() {
      return [gamepad];
    },
  };

  const context = {
    console: { log() {} },
    document,
    navigator,
    window,
    $: jquery,
    jQuery: jquery,
  };
  vm.createContext(context);
  const sourcePath = path.join(__dirname, "..", "js", "inputControls.js");
  vm.runInContext(fs.readFileSync(sourcePath, "utf8"), context, {
    filename: sourcePath,
  });

  return {
    clicked,
    handlers,
    gamepad,
    live: elements["#input-controls-status"],
    buttonTarget: elements["#button-right"],
    textEntry,
    runFrame() {
      assert.equal(typeof frame, "function");
      frame();
    },
  };
}

function keyEvent(key, target) {
  let prevented = 0;
  return {
    key,
    target,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    preventDefault() {
      prevented += 1;
    },
    get prevented() {
      return prevented;
    },
  };
}

test("keyboard shortcuts click the mapped controls and announce the action", () => {
  const harness = createHarness();
  const target = harness.buttonTarget;
  const handleKey = harness.handlers.keydown;

  const up = keyEvent("ArrowUp", target);
  handleKey(up);
  const reverse = keyEvent("b", target);
  handleKey(reverse);
  const emergency = keyEvent("Escape", target);
  handleKey(emergency);

  assert.deepEqual(harness.clicked, ["#button-right", "#dir-b", "#emergency-stop"]);
  assert.equal(up.prevented, 1);
  assert.equal(reverse.prevented, 1);
  assert.equal(emergency.prevented, 1);
  assert.equal(harness.live.textContent, "Throttle control: emergency-stop");
});

test("keyboard shortcuts ignore text-entry and modified-key events", () => {
  const harness = createHarness();
  const handleKey = harness.handlers.keydown;

  const textEntryEvent = keyEvent("ArrowUp", harness.textEntry);
  handleKey(textEntryEvent);

  const modifiedEvent = keyEvent("ArrowUp", harness.textEntry);
  modifiedEvent.target = { tagName: "BUTTON" };
  modifiedEvent.ctrlKey = true;
  handleKey(modifiedEvent);

  assert.deepEqual(harness.clicked, []);
  assert.equal(textEntryEvent.prevented, 0);
  assert.equal(modifiedEvent.prevented, 0);
});

test("gamepad axes and standard buttons map to throttle controls", () => {
  const harness = createHarness();
  harness.handlers.gamepadconnected();
  assert.equal(harness.live.textContent, "Gamepad controls connected");
  harness.runFrame();

  harness.gamepad.axes[1] = -1;
  harness.runFrame();
  harness.gamepad.axes[1] = 0;
  harness.runFrame();

  harness.gamepad.buttons[0].pressed = true;
  harness.runFrame();
  harness.gamepad.buttons[0].pressed = false;
  harness.runFrame();
  harness.gamepad.buttons[1].pressed = true;
  harness.runFrame();
  harness.gamepad.buttons[1].pressed = false;
  harness.runFrame();
  harness.gamepad.buttons[14].pressed = true;
  harness.runFrame();
  harness.gamepad.buttons[14].pressed = false;
  harness.runFrame();
  harness.gamepad.buttons[15].pressed = true;
  harness.runFrame();

  assert.deepEqual(harness.clicked, [
    "#button-right",
    "#normal-stop",
    "#emergency-stop",
    "#dir-b",
    "#dir-f",
  ]);
  harness.handlers.gamepaddisconnected();
  assert.equal(harness.live.textContent, "Gamepad controls disconnected");
});

test("the status region is a polite live region", () => {
  const harness = createHarness();
  assert.equal(harness.live.getAttribute("aria-live"), "polite");
});
