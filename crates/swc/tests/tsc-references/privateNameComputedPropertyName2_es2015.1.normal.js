function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @target: esnext, es2022, es2015
let getX;
var tmp = (getX = (a)=>_classPrivateFieldGet(a, _x)
, "_");
class A {
    [tmp]() {}
    constructor(){
        _x.set(this, {
            writable: true,
            value: 100
        });
    }
}
var _x = new WeakMap();
console.log(getX(new A));
