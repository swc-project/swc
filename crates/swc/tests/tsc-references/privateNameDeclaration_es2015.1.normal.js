function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
// @declaration: true
// @target: es2015
class A {
    quux() {}
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInit(this, _bar, {
            writable: true,
            value: 6
        });
        this.qux = 6;
    }
}
var _foo = new WeakMap();
var _bar = new WeakMap();
