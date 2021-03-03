// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/readable-stream-browser.dew.js


import _stream from "/npm:@jspm/core@1/nodelibs/stream.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  /*
   * This file is used by module bundlers (browserify/webpack/etc) when
   * including a stream implementation. We use "readable-stream" to get a
   * consistent behavior between nodejs versions but bundlers often have a shim
   * for "stream". Using this shim greatly improve the compatibility and greatly
   * reduce the final size of the bundle (only one stream implementation, not
   * two).
   */
  exports = _stream;
  return exports;
}