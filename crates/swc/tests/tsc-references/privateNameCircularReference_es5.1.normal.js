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
var _key;
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _foo.set(this, {
        writable: true,
        value: _classPrivateFieldGet(this, _bar)
    });
    _bar.set(this, {
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
