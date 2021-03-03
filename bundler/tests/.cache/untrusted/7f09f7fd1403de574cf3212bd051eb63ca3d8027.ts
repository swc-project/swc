// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/nodejs/NodejsStreamOutputAdapter.dew.js


import { dew as _readableStreamBrowserDewDew } from "../readable-stream-browser.dew.js";
import { dew as _utilsDewDew } from "../utils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var Readable = _readableStreamBrowserDewDew().Readable;

  var utils = _utilsDewDew();

  utils.inherits(NodejsStreamOutputAdapter, Readable);
  /**
  * A nodejs stream using a worker as source.
  * @see the SourceWrapper in http://nodejs.org/api/stream.html
  * @constructor
  * @param {StreamHelper} helper the helper wrapping the worker
  * @param {Object} options the nodejs stream options
  * @param {Function} updateCb the update callback.
  */

  function NodejsStreamOutputAdapter(helper, options, updateCb) {
    Readable.call(this, options);
    this._helper = helper;
    var self = this;
    helper.on("data", function (data, meta) {
      if (!self.push(data)) {
        self._helper.pause();
      }

      if (updateCb) {
        updateCb(meta);
      }
    }).on("error", function (e) {
      self.emit('error', e);
    }).on("end", function () {
      self.push(null);
    });
  }

  NodejsStreamOutputAdapter.prototype._read = function () {
    this._helper.resume();
  };

  exports = NodejsStreamOutputAdapter;
  return exports;
}