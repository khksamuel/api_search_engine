const path = require("path");

// Ensure a minimal `process.cwd()` exists for test environments that don't expose it.
if (typeof global.process === "undefined") {
  global.process = {};
}
if (typeof global.process.cwd !== "function") {
  global.process.cwd = () => path.resolve(".");
}
