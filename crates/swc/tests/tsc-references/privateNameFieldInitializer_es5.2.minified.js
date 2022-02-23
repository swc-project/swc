function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
var A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), _classPrivateFieldInit(this, _field, {
        writable: !0,
        value: 10
    }), _classPrivateFieldInit(this, _uninitialized, {
        writable: !0,
        value: void 0
    });
}, _field = new WeakMap(), _uninitialized = new WeakMap();
