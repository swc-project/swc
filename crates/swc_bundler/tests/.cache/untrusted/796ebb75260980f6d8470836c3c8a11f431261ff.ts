// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/tarn@3.0.0/dist/PromiseInspection.dew.js


var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  class PromiseInspection {
    constructor(args) {
      this._value = args.value;
      this._error = args.error;
    }

    value() {
      return this._value;
    }

    reason() {
      return this._error;
    }

    isRejected() {
      return !!this._error;
    }

    isFulfilled() {
      return !!this._value;
    }

  }

  exports.PromiseInspection = PromiseInspection;
  return exports;
}