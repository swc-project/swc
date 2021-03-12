// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/nodejs/NodejsStreamInputAdapter.dew.js


import { dew as _utilsDewDew } from "../utils.dew.js";
import { dew as _GenericWorkerDewDew } from "../stream/GenericWorker.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var utils = _utilsDewDew();

  var GenericWorker = _GenericWorkerDewDew();
  /**
   * A worker that use a nodejs stream as source.
   * @constructor
   * @param {String} filename the name of the file entry for this stream.
   * @param {Readable} stream the nodejs stream.
   */


  function NodejsStreamInputAdapter(filename, stream) {
    GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
    this._upstreamEnded = false;

    this._bindStream(stream);
  }

  utils.inherits(NodejsStreamInputAdapter, GenericWorker);
  /**
   * Prepare the stream and bind the callbacks on it.
   * Do this ASAP on node 0.10 ! A lazy binding doesn't always work.
   * @param {Stream} stream the nodejs stream to use.
   */

  NodejsStreamInputAdapter.prototype._bindStream = function (stream) {
    var self = this;
    this._stream = stream;
    stream.pause();
    stream.on("data", function (chunk) {
      self.push({
        data: chunk,
        meta: {
          percent: 0
        }
      });
    }).on("error", function (e) {
      if (self.isPaused) {
        this.generatedError = e;
      } else {
        self.error(e);
      }
    }).on("end", function () {
      if (self.isPaused) {
        self._upstreamEnded = true;
      } else {
        self.end();
      }
    });
  };

  NodejsStreamInputAdapter.prototype.pause = function () {
    if (!GenericWorker.prototype.pause.call(this)) {
      return false;
    }

    this._stream.pause();

    return true;
  };

  NodejsStreamInputAdapter.prototype.resume = function () {
    if (!GenericWorker.prototype.resume.call(this)) {
      return false;
    }

    if (this._upstreamEnded) {
      this.end();
    } else {
      this._stream.resume();
    }

    return true;
  };

  exports = NodejsStreamInputAdapter;
  return exports;
}