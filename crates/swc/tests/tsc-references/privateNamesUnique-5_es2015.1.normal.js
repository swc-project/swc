function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
// @strict: true
// @target: es6
// @strictPropertyInitialization: false
// same as privateNamesUnique-1, but with an interface
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: void 0
        });
    }
}
var _foo = new WeakMap();
class B {
    constructor(){
        _classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: void 0
        });
    }
}
var _foo1 = new WeakMap();
const b = new B();
