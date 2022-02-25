function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
var _foo = new WeakMap(), A = function() {
    "use strict";
    _classCallCheck(this, A), _classPrivateFieldInit(this, _foo, {
        writable: !0,
        value: void 0
    });
    var _foo1 = new WeakMap(), A1 = function() {
        _classCallCheck(this, A1), _classPrivateFieldInit(this, _foo1, {
            writable: !0,
            value: void 0
        });
    };
};
