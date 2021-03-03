// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/reader/readerFor.dew.js


import { dew as _utilsDewDew } from "../utils.dew.js";
import { dew as _supportDewDew } from "../support.dew.js";
import { dew as _ArrayReaderDewDew } from "./ArrayReader.dew.js";
import { dew as _StringReaderDewDew } from "./StringReader.dew.js";
import { dew as _NodeBufferReaderDewDew } from "./NodeBufferReader.dew.js";
import { dew as _Uint8ArrayReaderDewDew } from "./Uint8ArrayReader.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var utils = _utilsDewDew();

  var support = _supportDewDew();

  var ArrayReader = _ArrayReaderDewDew();

  var StringReader = _StringReaderDewDew();

  var NodeBufferReader = _NodeBufferReaderDewDew();

  var Uint8ArrayReader = _Uint8ArrayReaderDewDew();
  /**
   * Create a reader adapted to the data.
   * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
   * @return {DataReader} the data reader.
   */


  exports = function (data) {
    var type = utils.getTypeOf(data);
    utils.checkSupport(type);

    if (type === "string" && !support.uint8array) {
      return new StringReader(data);
    }

    if (type === "nodebuffer") {
      return new NodeBufferReader(data);
    }

    if (support.uint8array) {
      return new Uint8ArrayReader(utils.transformTo("uint8array", data));
    }

    return new ArrayReader(utils.transformTo("array", data));
  };

  return exports;
}