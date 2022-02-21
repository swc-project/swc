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
// @target: es6
class D {
}
class C {
    foo() {
        const c = new C();
        _classPrivateFieldGet(c, _x); // OK
        const d = new C();
        _classPrivateFieldGet(d, _x); // Error
    }
    constructor(){
        _classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
var _x = new WeakMap();
