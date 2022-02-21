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
class B {
}
class A extends B {
    constructor(){
        void 0;
        super();
        _classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
var _x = new WeakMap();
