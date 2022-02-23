function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
// @target: esnext, es2022, es2015
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: 1
        });
        _classPrivateFieldInit(this, _prop, {
            writable: true,
            value: 2
        });
    }
}
var _foo = new WeakMap();
var _prop = new WeakMap();
A.inst = new A();
