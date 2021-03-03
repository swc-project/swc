// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/stream/Crc32Probe.dew.js


import { dew as _GenericWorkerDewDew } from "./GenericWorker.dew.js";
import { dew as _crc32DewDew } from "../crc32.dew.js";
import { dew as _utilsDewDew } from "../utils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var GenericWorker = _GenericWorkerDewDew();

  var crc32 = _crc32DewDew();

  var utils = _utilsDewDew();
  /**
   * A worker which calculate the crc32 of the data flowing through.
   * @constructor
   */


  function Crc32Probe() {
    GenericWorker.call(this, "Crc32Probe");
    this.withStreamInfo("crc32", 0);
  }

  utils.inherits(Crc32Probe, GenericWorker);
  /**
   * @see GenericWorker.processChunk
   */

  Crc32Probe.prototype.processChunk = function (chunk) {
    this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
    this.push(chunk);
  };

  exports = Crc32Probe;
  return exports;
}