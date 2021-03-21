// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/stream/ConvertWorker.dew.js


import { dew as _GenericWorkerDewDew } from "./GenericWorker.dew.js";
import { dew as _utilsDewDew } from "../utils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var GenericWorker = _GenericWorkerDewDew();

  var utils = _utilsDewDew();
  /**
   * A worker which convert chunks to a specified type.
   * @constructor
   * @param {String} destType the destination type.
   */


  function ConvertWorker(destType) {
    GenericWorker.call(this, "ConvertWorker to " + destType);
    this.destType = destType;
  }

  utils.inherits(ConvertWorker, GenericWorker);
  /**
   * @see GenericWorker.processChunk
   */

  ConvertWorker.prototype.processChunk = function (chunk) {
    this.push({
      data: utils.transformTo(this.destType, chunk.data),
      meta: chunk.meta
    });
  };

  exports = ConvertWorker;
  return exports;
}