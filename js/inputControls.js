/* Accessible keyboard, macropad, and gamepad controls for the throttle. */
(function (window, document, $) {
  "use strict";

  var gamepadFrame = null;
  var previousButtons = [];
  var previousAxis = 0;
  var gamepadActive = false;

  function isTextEntry(target) {
    if (!target || !target.tagName) return false;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable;
  }

  function clickControl(selector) {
    var control = document.querySelector(selector);
    if (control && !control.disabled && !$(control).hasClass("ui-state-disabled")) {
      control.click();
      return true;
    }
    return false;
  }

  function announce(message) {
    var live = document.getElementById("input-controls-status");
    if (live) live.textContent = message;
  }

  function handleKey(event) {
    if (isTextEntry(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;

    var selector;
    switch (event.key) {
      case "ArrowUp": selector = "#button-right"; break;
      case "ArrowDown": selector = "#button-left"; break;
      case "f": case "F": selector = "#dir-f"; break;
      case "b": case "B": selector = "#dir-b"; break;
      case " ": selector = "#normal-stop"; break;
      case "Escape": selector = "#emergency-stop"; break;
      default: return;
    }

    event.preventDefault();
    if (clickControl(selector)) announce("Throttle control: " + selector.substring(1));
  }

  function buttonPressed(gamepad, index) {
    return !!(gamepad.buttons[index] && gamepad.buttons[index].pressed);
  }

  function pollGamepad() {
    var pads = navigator.getGamepads ? navigator.getGamepads() : [];
    var pad = pads && pads[0];
    if (!pad) {
      gamepadFrame = null;
      return;
    }

    var axis = pad.axes && pad.axes.length ? pad.axes[1] || 0 : 0;
    if (axis < -0.5 && previousAxis >= -0.5) clickControl("#button-right");
    if (axis > 0.5 && previousAxis <= 0.5) clickControl("#button-left");
    previousAxis = axis;

    // Standard mapping: A=normal stop, B=emergency stop, D-pad left/right=direction.
    var actions = { 0: "#normal-stop", 1: "#emergency-stop", 14: "#dir-b", 15: "#dir-f" };
    Object.keys(actions).forEach(function (index) {
      var pressed = buttonPressed(pad, Number(index));
      if (pressed && !previousButtons[index]) clickControl(actions[index]);
      previousButtons[index] = pressed;
    });
    gamepadFrame = window.requestAnimationFrame(pollGamepad);
  }

  function connectGamepad() {
    if (!gamepadActive) {
      gamepadActive = true;
      announce("Gamepad controls connected");
      if (!gamepadFrame) gamepadFrame = window.requestAnimationFrame(pollGamepad);
    }
  }

  function disconnectGamepad() {
    gamepadActive = false;
    previousButtons = [];
    previousAxis = 0;
    if (gamepadFrame) window.cancelAnimationFrame(gamepadFrame);
    gamepadFrame = null;
    announce("Gamepad controls disconnected");
  }

  $(function () {
    $(document).on("keydown", handleKey);
    window.addEventListener("gamepadconnected", connectGamepad);
    window.addEventListener("gamepaddisconnected", disconnectGamepad);

    var status = document.createElement("div");
    status.id = "input-controls-status";
    status.className = "sr-only";
    status.setAttribute("aria-live", "polite");
    document.body.appendChild(status);
  });
}(window, document, window.jQuery));
