function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
// @target: es2015
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: _classPrivateFieldGet(this, _bar)
        });
        _classPrivateFieldInit(this, _bar, {
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
        _classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: _classPrivateMethodGet(this, _bar1, bar).call(this)
        });
        _classPrivateMethodInit(this, _bar1);
    }
}
var _foo1 = new WeakMap();
function bar() {
    return 3;
}
var _bar2 = new WeakSet();
class A3 {
    constructor(){
        _classPrivateFieldInit(this, _foo2, {
            writable: true,
            value: _classPrivateMethodGet(this, _bar2, bar1)
        });
        _classPrivateMethodInit(this, _bar2);
    }
}
var _foo2 = new WeakMap();
function bar1() {
    return 3;
}
class B {
    constructor(){
        _classPrivateFieldInit(this, _foo3, {
            writable: true,
            value: _classPrivateFieldGet(this, _bar3)
        });
        _classPrivateFieldInit(this, _bar3, {
            writable: true,
            value: _classPrivateFieldGet(this, _foo3)
        });
    }
}
var _foo3 = new WeakMap();
var _bar3 = new WeakMap();
