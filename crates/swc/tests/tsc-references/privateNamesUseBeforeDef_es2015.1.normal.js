function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @target: es2015
class A {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: _classPrivateFieldGet(this, _bar)
        });
        _bar.set(this, {
            writable: true,
            value: 3
        });
    }
}
var _foo = new WeakMap();
var _bar = new WeakMap();
class B {
    constructor(){
        _foo1.set(this, {
            writable: true,
            value: _classPrivateFieldGet(this, _bar1)
        });
        _bar1.set(this, {
            writable: true,
            value: _classPrivateFieldGet(this, _foo1)
        });
    }
}
var _foo1 = new WeakMap();
var _bar1 = new WeakMap();
