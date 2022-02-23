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
class A1 {
}
class C {
    constructor(){
        _classPrivateFieldInit(this, _something, {
            writable: true,
            value: void 0
        });
    }
}
var _something = new WeakMap();
const c = a;
