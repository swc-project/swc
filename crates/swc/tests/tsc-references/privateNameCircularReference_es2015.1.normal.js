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
var _key;
// @strict: true
// @target: es6
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: _classPrivateFieldGet(this, _bar)
        });
        _classPrivateFieldInit(this, _bar, {
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
