function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
var _foo = new WeakMap();
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _classPrivateFieldInit(this, _foo, {
        writable: true,
        value: void 0
    });
    var _foo1 = new WeakMap();
    var A1 = function A1() {
        _classCallCheck(this, A1);
        _classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: void 0
        });
    };
};
