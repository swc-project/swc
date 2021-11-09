// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/flate.dew.js


import { dew as _npmPakoDew } from "/npm:pako@1.0?dew";
import { dew as _utilsDewDew } from "./utils.dew.js";
import { dew as _GenericWorkerDewDew } from "./stream/GenericWorker.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  var USE_TYPEDARRAY = typeof Uint8Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Uint32Array !== 'undefined';

  var pako = _npmPakoDew();

  var utils = _utilsDewDew();

  var GenericWorker = _GenericWorkerDewDew();

  var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";
  exports.magic = "\x08\x00";
  /**
   * Create a worker that uses pako to inflate/deflate.
   * @constructor
   * @param {String} action the name of the pako function to call : either "Deflate" or "Inflate".
   * @param {Object} options the options to use when (de)compressing.
   */

  function FlateWorker(action, options) {
    GenericWorker.call(this, "FlateWorker/" + action);
    this._pako = null;
    this._pakoAction = action;
    this._pakoOptions = options; // the `meta` object from the last chunk received
    // this allow this worker to pass around metadata

    this.meta = {};
  }

  utils.inherits(FlateWorker, GenericWorker);
  /**
   * @see GenericWorker.processChunk
   */

  FlateWorker.prototype.processChunk = function (chunk) {
    this.meta = chunk.meta;

    if (this._pako === null) {
      this._createPako();
    }

    this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
  };
  /**
   * @see GenericWorker.flush
   */


  FlateWorker.prototype.flush = function () {
    GenericWorker.prototype.flush.call(this);

    if (this._pako === null) {
      this._createPako();
    }

    this._pako.push([], true);
  };
  /**
   * @see GenericWorker.cleanUp
   */


  FlateWorker.prototype.cleanUp = function () {
    GenericWorker.prototype.cleanUp.call(this);
    this._pako = null;
  };
  /**
   * Create the _pako object.
   * TODO: lazy-loading this object isn't the best solution but it's the
   * quickest. The best solution is to lazy-load the worker list. See also the
   * issue #446.
   */


  FlateWorker.prototype._createPako = function () {
    this._pako = new pako[this._pakoAction]({
      raw: true,
      level: this._pakoOptions.level || -1 // default compression

    });
    var self = this;

    this._pako.onData = function (data) {
      self.push({
        data: data,
        meta: self.meta
      });
    };
  };

  exports.compressWorker = function (compressionOptions) {
    return new FlateWorker("Deflate", compressionOptions);
  };

  exports.uncompressWorker = function () {
    return new FlateWorker("Inflate", {});
  };

  return exports;
}