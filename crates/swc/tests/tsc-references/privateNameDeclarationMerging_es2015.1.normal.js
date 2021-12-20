function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
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
        _x.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _x = new WeakMap();
