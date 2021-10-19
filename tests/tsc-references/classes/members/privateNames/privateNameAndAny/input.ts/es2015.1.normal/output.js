function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @strict: true
// @target: es6
class A {
    method(thing) {
        _classPrivateFieldGet(thing, _foo); // OK
        _classPrivateFieldGet(thing, _bar); // Error
    }
    constructor(){
        _foo.set(this, {
            writable: true,
            value: true
        });
    }
}
var _foo = new WeakMap();
