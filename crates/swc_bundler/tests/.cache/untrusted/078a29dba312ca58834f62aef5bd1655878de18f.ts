// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/reader/StringReader.dew.js


import { dew as _DataReaderDewDew } from "./DataReader.dew.js";
import { dew as _utilsDewDew } from "../utils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var DataReader = _DataReaderDewDew();

  var utils = _utilsDewDew();

  function StringReader(data) {
    DataReader.call(this, data);
  }

  utils.inherits(StringReader, DataReader);
  /**
   * @see DataReader.byteAt
   */

  StringReader.prototype.byteAt = function (i) {
    return this.data.charCodeAt(this.zero + i);
  };
  /**
   * @see DataReader.lastIndexOfSignature
   */


  StringReader.prototype.lastIndexOfSignature = function (sig) {
    return this.data.lastIndexOf(sig) - this.zero;
  };
  /**
   * @see DataReader.readAndCheckSignature
   */


  StringReader.prototype.readAndCheckSignature = function (sig) {
    var data = this.readData(4);
    return sig === data;
  };
  /**
   * @see DataReader.readData
   */


  StringReader.prototype.readData = function (size) {
    this.checkOffset(size); // this will work because the constructor applied the "& 0xff" mask.

    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };

  exports = StringReader;
  return exports;
}