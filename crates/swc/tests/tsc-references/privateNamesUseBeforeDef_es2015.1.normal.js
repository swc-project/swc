function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
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
var _bar1 = new WeakSet();
class A2 {
    constructor(){
        _foo1.set(this, {
            writable: true,
            value: _classPrivateMethodGet(this, _bar1, bar).call(this)
        });
        _bar1.add(this);
    }
}
var _foo1 = new WeakMap();
function bar() {
    return 3;
}
var _bar2 = new WeakSet();
class A3 {
    constructor(){
        _foo2.set(this, {
            writable: true,
            value: _classPrivateMethodGet(this, _bar2, bar1)
        });
        _bar2.add(this);
    }
}
var _foo2 = new WeakMap();
function bar1() {
    return 3;
}
class B {
    constructor(){
        _foo3.set(this, {
            writable: true,
            value: _classPrivateFieldGet(this, _bar3)
        });
        _bar3.set(this, {
            writable: true,
            value: _classPrivateFieldGet(this, _foo3)
        });
    }
}
var _foo3 = new WeakMap();
var _bar3 = new WeakMap();
