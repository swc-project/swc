// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/stream/DataLengthProbe.dew.js


import { dew as _utilsDewDew } from "../utils.dew.js";
import { dew as _GenericWorkerDewDew } from "./GenericWorker.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var utils = _utilsDewDew();

  var GenericWorker = _GenericWorkerDewDew();
  /**
   * A worker which calculate the total length of the data flowing through.
   * @constructor
   * @param {String} propName the name used to expose the length
   */


  function DataLengthProbe(propName) {
    GenericWorker.call(this, "DataLengthProbe for " + propName);
    this.propName = propName;
    this.withStreamInfo(propName, 0);
  }

  utils.inherits(DataLengthProbe, GenericWorker);
  /**
   * @see GenericWorker.processChunk
   */

  DataLengthProbe.prototype.processChunk = function (chunk) {
    if (chunk) {
      var length = this.streamInfo[this.propName] || 0;
      this.streamInfo[this.propName] = length + chunk.data.length;
    }

    GenericWorker.prototype.processChunk.call(this, chunk);
  };

  exports = DataLengthProbe;
  return exports;
}