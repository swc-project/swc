// Node version of reading a wasm file into an array buffer.
const fs = require("fs");
const path = require("path");

module.exports = function readWasm() {
  return new Promise((resolve, reject) => {
    const wasmPath = path.join(__dirname, "mappings.wasm");
    fs.readFile(wasmPath, null, (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(data.buffer);
    });
  });
};
module.exports.sync = function readWasmSync() {
  const wasmPath = path.join(__dirname, "mappings.wasm");
  return fs.readFileSync(wasmPath).buffer;
};

module.exports.initialize = _ => {
  console.debug("SourceMapConsumer.initialize is a no-op when running in node.js");
};
