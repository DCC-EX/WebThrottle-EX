const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");

function loadBrowserScripts(...scriptNames) {
  const context = {
    console: { log() {} },
    document: {},
    setInterval,
    clearInterval,
    setTimeout,
    clearTimeout,
    Number,
    String,
    Date,
    Math,
    JSON,
    parseInt,
    alert() {},
    $() {
      return { ready() {}, on() { return this; } };
    },
  };
  context.window = context;
  context.addEventListener = () => {};
  vm.createContext(context);

  for (const scriptName of scriptNames) {
    const scriptPath = path.join(repoRoot, "js", scriptName);
    vm.runInContext(fs.readFileSync(scriptPath, "utf8"), context, { filename: scriptPath });
  }

  return context;
}

test("consumeDccExResponses preserves fragmented and back-to-back frames", () => {
  const context = loadBrowserScripts("commandController.js");
  let parsed = context.consumeDccExResponses(
    "",
    "<c CurrentMAIN 0 C Milli 0 1997"
  );
  assert.deepEqual(Array.from(parsed.responses), []);
  assert.equal(parsed.remainder, "<c CurrentMAIN 0 C Milli 0 1997");

  parsed = context.consumeDccExResponses(
    parsed.remainder,
    " 1 1997>\n<a 0>\n"
  );
  assert.deepEqual(Array.from(parsed.responses), [
    "<c CurrentMAIN 0 C Milli 0 1997 1 1997>",
    "<a 0>",
  ]);
  assert.equal(parsed.remainder, "");
});

test("consumeDccExResponses retains all characters across receive chunks", () => {
  const context = loadBrowserScripts("commandController.js");
  let parsed = context.consumeDccExResponses("", "<p1><iDCC-EX V-3.1.6 / MEGA / STAN");
  assert.deepEqual(Array.from(parsed.responses), ["<p1>"]);

  parsed = context.consumeDccExResponses(parsed.remainder, "DARD_MOTOR\n");
  assert.deepEqual(Array.from(parsed.responses), []);

  parsed = context.consumeDccExResponses(parsed.remainder, "_SHIELD G-50fcbc0>\n");
  assert.deepEqual(Array.from(parsed.responses), ["<iDCC-EX V-3.1.6 / MEGA / STANDARD_MOTOR\n_SHIELD G-50fcbc0>"]);
  assert.equal(parsed.remainder, "");
});

test("readLoop dispatches complete frames without losing stream chunks", async () => {
  const context = loadBrowserScripts("commandController.js");
  const received = [];
  const logs = [];
  const chunks = [
    { value: "<p1><iDCC-EX V-3.1.6 / MEGA / STAN", done: false },
    { value: "DARD_MOTOR\n", done: false },
    { value: "_SHIELD G-50fcbc0>\n<a 0>\n", done: false },
    { value: undefined, done: true },
  ];

  context.displayLog = value => logs.push(value);
  context.getTimeStamp = () => "";
  context.parseResponse = value => received.push(value);
  context.reader = { async read() { return chunks.shift(); }, releaseLock() {} };

  await context.readLoop();

  assert.deepEqual(Array.from(received), [
    "<p1>",
    "<iDCC-EX V-3.1.6 / MEGA / STANDARD_MOTOR\n_SHIELD G-50fcbc0>",
    "<a 0>",
  ]);
  assert.equal(logs.length, 3);
});

test("function buttons use the per-function uppercase F command", () => {
  const context = loadBrowserScripts("commandController.js");
  const values = {};
  const commands = [];
  context.getCV = () => 123;
  context.setFunCurrentVal = (name, value) => { values[name] = value; };
  context.getFunCurrentVal = name => values[name] || 0;
  context.writeToStream = command => commands.push(command);

  context.sendCommandForFunction(17, 1);

  assert.deepEqual(commands, ["F 123 17 1"]);
  assert.equal(values.f17, 1);
});

test("direction/speed commands are suppressed when no loco is selected", () => {
  const context = loadBrowserScripts("commandController.js", "exwebthrottle.js");
  const commands = [];
  context.writeToStream = command => commands.push(command);

  context.sendSpeed(0, 20, 1);
  context.sendSpeed("", 20, 1);
  context.sendSpeed(123, 20, 1);

  assert.deepEqual(commands, ["t 123 20 1"]);
});
