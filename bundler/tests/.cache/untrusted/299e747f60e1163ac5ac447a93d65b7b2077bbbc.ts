// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/tarn@3.0.0/dist/utils.dew.js


import { dew as _PromiseInspectionDewDew } from "./PromiseInspection.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  const PromiseInspection_1 = _PromiseInspectionDewDew();

  function defer() {
    let resolve = null;
    let reject = null;
    const promise = new Promise((resolver, rejecter) => {
      resolve = resolver;
      reject = rejecter;
    });
    return {
      promise,
      resolve,
      reject
    };
  }

  exports.defer = defer;

  function now() {
    return Date.now();
  }

  exports.now = now;

  function duration(t1, t2) {
    return Math.abs(t2 - t1);
  }

  exports.duration = duration;

  function checkOptionalTime(time) {
    if (typeof time === 'undefined') {
      return true;
    }

    return checkRequiredTime(time);
  }

  exports.checkOptionalTime = checkOptionalTime;

  function checkRequiredTime(time) {
    return typeof time === 'number' && time === Math.round(time) && time > 0;
  }

  exports.checkRequiredTime = checkRequiredTime;

  function delay(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  exports.delay = delay;

  function reflect(promise) {
    return promise.then(value => {
      return new PromiseInspection_1.PromiseInspection({
        value
      });
    }).catch(error => {
      return new PromiseInspection_1.PromiseInspection({
        error
      });
    });
  }

  exports.reflect = reflect;

  function tryPromise(cb) {
    try {
      const result = cb();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  exports.tryPromise = tryPromise;
  return exports;
}