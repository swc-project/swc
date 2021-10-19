function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
var _key;
// @strict: true
// @target: es6
class A {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: _classPrivateFieldGet(this, _bar)
        });
        _bar.set(this, {
            writable: true,
            value: _classPrivateFieldGet(this, _foo)
        });
        this[_key] // Error (should *not* be private name error)
         = this["#baz"];
    }
}
var _foo = new WeakMap();
var _bar = new WeakMap();
_key = "#baz";
