function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
var _b = new WeakSet(), _c = new WeakSet();
// @target: es2015
// @importHelpers: true
// @isolatedModules: true
// @filename: main.ts
export var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    _a.set(this, {
        writable: true,
        value: 1
    });
    _b.add(this);
    _c.add(this);
};
var _a = new WeakMap();
function b() {
    _classPrivateFieldSet(this, _c, 42);
}
function c(v) {
    _classPrivateFieldSet(this, _a, _classPrivateFieldGet(this, _a) + v);
}
