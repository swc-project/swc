// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/inherits@2.0.4/inherits_browser.dew.js


var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    // old school shim for old browsers
    exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;

        var TempCtor = function () {};

        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }

  return exports;
}