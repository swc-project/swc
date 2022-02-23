function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
class C {
    static test() {
        _classPrivateFieldSet(new C(), _x, 10);
        const y = new C();
        const z = new y();
        z.x = 123;
    }
    constructor(){
        _classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
var _x = new WeakMap();
