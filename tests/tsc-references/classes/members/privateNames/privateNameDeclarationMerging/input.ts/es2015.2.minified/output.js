function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
class C {
    foo() {
        const c = new C();
        _classPrivateFieldGet(c, _x);
        const d = new C();
        _classPrivateFieldGet(d, _x);
    }
    constructor(){
        _x.set(this, {
            writable: !0,
            value: void 0
        });
    }
}
var _x = new WeakMap();
