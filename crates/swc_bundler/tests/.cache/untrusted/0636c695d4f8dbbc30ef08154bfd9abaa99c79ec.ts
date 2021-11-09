// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/reader/ArrayReader.dew.js


import { dew as _DataReaderDewDew } from "./DataReader.dew.js";
import { dew as _utilsDewDew } from "../utils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var DataReader = _DataReaderDewDew();

  var utils = _utilsDewDew();

  function ArrayReader(data) {
    DataReader.call(this, data);

    for (var i = 0; i < this.data.length; i++) {
      data[i] = data[i] & 0xFF;
    }
  }

  utils.inherits(ArrayReader, DataReader);
  /**
   * @see DataReader.byteAt
   */

  ArrayReader.prototype.byteAt = function (i) {
    return this.data[this.zero + i];
  };
  /**
   * @see DataReader.lastIndexOfSignature
   */


  ArrayReader.prototype.lastIndexOfSignature = function (sig) {
    var sig0 = sig.charCodeAt(0),
        sig1 = sig.charCodeAt(1),
        sig2 = sig.charCodeAt(2),
        sig3 = sig.charCodeAt(3);

    for (var i = this.length - 4; i >= 0; --i) {
      if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
        return i - this.zero;
      }
    }

    return -1;
  };
  /**
   * @see DataReader.readAndCheckSignature
   */


  ArrayReader.prototype.readAndCheckSignature = function (sig) {
    var sig0 = sig.charCodeAt(0),
        sig1 = sig.charCodeAt(1),
        sig2 = sig.charCodeAt(2),
        sig3 = sig.charCodeAt(3),
        data = this.readData(4);
    return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
  };
  /**
   * @see DataReader.readData
   */


  ArrayReader.prototype.readData = function (size) {
    this.checkOffset(size);

    if (size === 0) {
      return [];
    }

    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };

  exports = ArrayReader;
  return exports;
}