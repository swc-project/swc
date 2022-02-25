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
var A1 = function A1() {
    "use strict";
    _classCallCheck(this, A1);
};
var _something = new WeakMap();
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    _classPrivateFieldInit(this, _something, {
        writable: true,
        value: void 0
    });
};
var c = a;
