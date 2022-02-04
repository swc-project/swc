function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
// @strict: true
// @target: esnext, es2022
// @useDefineForClassFields: false
class Foo {
    m1(v) {
        _classPrivateFieldGet(this, _p1).call(this, v);
        v;
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
var _p11 = new WeakSet();
class Foo2 {
    m1(v) {
        _classPrivateMethodGet(this, _p11, p1).call(this, v);
        v;
    }
    constructor(){
        _p11.add(this);
    }
}
function p1(v) {
    if (typeof v !== "string") {
        throw new Error();
    }
}
