// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/tarn@3.0.0/dist/TimeoutError.dew.js


var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  class TimeoutError extends Error {}

  exports.TimeoutError = TimeoutError;
  return exports;
}