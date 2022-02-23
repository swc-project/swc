function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
var _key;
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _classPrivateFieldInit(this, _foo, {
        writable: true,
        value: _classPrivateFieldGet(this, _bar)
    });
    _classPrivateFieldInit(this, _bar, {
        writable: true,
        value: _classPrivateFieldGet(this, _foo)
    });
    // @strict: true
    // @target: es6
    this[_key] // Error (should *not* be private name error)
     = this["#baz"];
};
var _foo = new WeakMap();
var _bar = new WeakMap();
_key = "#baz";
