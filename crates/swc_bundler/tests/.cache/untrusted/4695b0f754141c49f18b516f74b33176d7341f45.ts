// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/reader/Uint8ArrayReader.dew.js


import { dew as _ArrayReaderDewDew } from "./ArrayReader.dew.js";
import { dew as _utilsDewDew } from "../utils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var ArrayReader = _ArrayReaderDewDew();

  var utils = _utilsDewDew();

  function Uint8ArrayReader(data) {
    ArrayReader.call(this, data);
  }

  utils.inherits(Uint8ArrayReader, ArrayReader);
  /**
   * @see DataReader.readData
   */

  Uint8ArrayReader.prototype.readData = function (size) {
    this.checkOffset(size);

    if (size === 0) {
      // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].
      return new Uint8Array(0);
    }

    var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };

  exports = Uint8ArrayReader;
  return exports;
}