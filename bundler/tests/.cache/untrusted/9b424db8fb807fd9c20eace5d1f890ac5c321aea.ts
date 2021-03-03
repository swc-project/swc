// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/tarn@3.0.0/dist/PendingOperation.dew.js


import { dew as _TimeoutErrorDewDew } from "./TimeoutError.dew.js";
import { dew as _utilsDewDew } from "./utils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  const TimeoutError_1 = _TimeoutErrorDewDew();

  const utils_1 = _utilsDewDew();

  class PendingOperation {
    constructor(timeoutMillis) {
      this.timeoutMillis = timeoutMillis;
      this.deferred = utils_1.defer();
      this.possibleTimeoutCause = null;
      this.isRejected = false;
      this.promise = timeout(this.deferred.promise, timeoutMillis).catch(err => {
        if (err instanceof TimeoutError_1.TimeoutError) {
          if (this.possibleTimeoutCause) {
            err = new TimeoutError_1.TimeoutError(this.possibleTimeoutCause.message);
          } else {
            err = new TimeoutError_1.TimeoutError('operation timed out for an unknown reason');
          }
        }

        this.isRejected = true;
        return Promise.reject(err);
      });
    }

    abort() {
      this.reject(new Error('aborted'));
    }

    reject(err) {
      this.deferred.reject(err);
    }

    resolve(value) {
      this.deferred.resolve(value);
    }

  }

  exports.PendingOperation = PendingOperation;

  function timeout(promise, time) {
    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(() => reject(new TimeoutError_1.TimeoutError()), time);
      promise.then(result => {
        clearTimeout(timeoutHandle);
        resolve(result);
      }).catch(err => {
        clearTimeout(timeoutHandle);
        reject(err);
      });
    });
  }

  return exports;
}