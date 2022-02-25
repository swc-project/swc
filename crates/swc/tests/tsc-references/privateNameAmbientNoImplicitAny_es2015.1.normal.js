function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
var _prop = new WeakMap();
class B {
    constructor(){
        _classPrivateFieldInit(this, _prop, {
            writable: true,
            value: void 0
        });
    }
}
