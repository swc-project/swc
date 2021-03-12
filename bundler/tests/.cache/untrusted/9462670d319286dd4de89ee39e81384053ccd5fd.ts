// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/tarn@3.0.0/dist/tarn.dew.js


import { dew as _PoolDewDew } from "./Pool.dew.js";
import { dew as _TimeoutErrorDewDew } from "./TimeoutError.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  const Pool_1 = _PoolDewDew();

  exports.Pool = Pool_1.Pool;

  const TimeoutError_1 = _TimeoutErrorDewDew();

  exports.TimeoutError = TimeoutError_1.TimeoutError;
  exports = {
    Pool: Pool_1.Pool,
    TimeoutError: TimeoutError_1.TimeoutError
  };
  return exports;
}