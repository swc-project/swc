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
        _x.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _x = new WeakMap();
