// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/compressions.dew.js


import { dew as _GenericWorkerDewDew } from "./stream/GenericWorker.dew.js";
import { dew as _flateDewDew } from "./flate.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var GenericWorker = _GenericWorkerDewDew();

  exports.STORE = {
    magic: "\x00\x00",
    compressWorker: function (compressionOptions) {
      return new GenericWorker("STORE compression");
    },
    uncompressWorker: function () {
      return new GenericWorker("STORE decompression");
    }
  };
  exports.DEFLATE = _flateDewDew();
  return exports;
}