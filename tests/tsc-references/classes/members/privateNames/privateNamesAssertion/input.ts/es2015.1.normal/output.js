function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @strict: true
// @target: esnext
class Foo {
    m1(v1) {
        _classPrivateFieldGet(this, _p1).call(this, v1);
        v1;
    }
    constructor(){
        _p1.set(this, {
            writable: true,
            value: (v)=>{
                if (typeof v !== "string") {
                    throw new Error();
                }
            }
        });
    }
}
var _p1 = new WeakMap();
