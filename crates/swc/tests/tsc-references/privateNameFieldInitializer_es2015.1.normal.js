function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
// @target: es2015
class A {
    constructor(){
        _classPrivateFieldInit(this, _field, {
            writable: true,
            value: 10
        });
        _classPrivateFieldInit(this, _uninitialized, {
            writable: true,
            value: void 0
        });
    }
}
var _field = new WeakMap();
var _uninitialized = new WeakMap();
