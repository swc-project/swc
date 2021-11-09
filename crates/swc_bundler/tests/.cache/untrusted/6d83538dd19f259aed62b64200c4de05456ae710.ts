// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/external.dew.js


import { dew as _npmLieDew } from "/npm:lie@3.3?dew";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  // load the global object first:
  // - it should be better integrated in the system (unhandledRejection in node)
  // - the environment may have a custom Promise implementation (see zone.js)
  var ES6Promise = null;

  if (typeof Promise !== "undefined") {
    ES6Promise = Promise;
  } else {
    ES6Promise = _npmLieDew();
  }
  /**
   * Let the user use/change some implementations.
   */


  exports = {
    Promise: ES6Promise
  };
  return exports;
}