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
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
var _method = new WeakSet(), _acc = new WeakSet(), _acc = new WeakSet();
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _classPrivateFieldInit(this, _field, {
        writable: true,
        value: 123
    });
    _classPrivateMethodInit(this, _method);
    _classPrivateMethodInit(this, _acc);
    _classPrivateMethodInit(this, _acc);
};
var _field = new WeakMap();
var _sField = {
    writable: true,
    value: "hello world"
};
function method() {}
function sMethod() {}
function acc() {
    return "";
}
function acc(x) {}
function sAcc() {
    return 0;
}
function sAcc(x) {}
