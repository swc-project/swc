// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/reader/NodeBufferReader.dew.js


import { dew as _Uint8ArrayReaderDewDew } from "./Uint8ArrayReader.dew.js";
import { dew as _utilsDewDew } from "../utils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var Uint8ArrayReader = _Uint8ArrayReaderDewDew();

  var utils = _utilsDewDew();

  function NodeBufferReader(data) {
    Uint8ArrayReader.call(this, data);
  }

  utils.inherits(NodeBufferReader, Uint8ArrayReader);
  /**
   * @see DataReader.readData
   */

  NodeBufferReader.prototype.readData = function (size) {
    this.checkOffset(size);
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };

  exports = NodeBufferReader;
  return exports;
}