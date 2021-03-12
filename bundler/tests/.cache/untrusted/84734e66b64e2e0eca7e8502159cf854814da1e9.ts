// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/support.dew.js


import { dew as _readableStreamBrowserDewDew } from "./readable-stream-browser.dew.js";
import _buffer from "/npm:@jspm/core@1/nodelibs/buffer.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  var Buffer = _buffer.Buffer;
  exports.base64 = true;
  exports.array = true;
  exports.string = true;
  exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
  exports.nodebuffer = typeof Buffer !== "undefined"; // contains true if JSZip can read/generate Uint8Array, false otherwise.

  exports.uint8array = typeof Uint8Array !== "undefined";

  if (typeof ArrayBuffer === "undefined") {
    exports.blob = false;
  } else {
    var buffer = new ArrayBuffer(0);

    try {
      exports.blob = new Blob([buffer], {
        type: "application/zip"
      }).size === 0;
    } catch (e) {
      try {
        var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
        var builder = new Builder();
        builder.append(buffer);
        exports.blob = builder.getBlob('application/zip').size === 0;
      } catch (e) {
        exports.blob = false;
      }
    }
  }

  try {
    exports.nodestream = !!_readableStreamBrowserDewDew().Readable;
  } catch (e) {
    exports.nodestream = false;
  }

  return exports;
}