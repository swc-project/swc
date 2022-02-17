function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
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
// @target: esnext, es2022, es2015
let getX;
class C {
    constructor(x){
        _x.set(this, {
            writable: true,
            value: 1
        });
        _classPrivateFieldSet(this, _x, x);
    }
}
var _x = new WeakMap();
var __ = {
    writable: true,
    value: (()=>{
        // getX has privileged access to #x
        getX = (obj)=>_classPrivateFieldGet(obj, _x)
        ;
    })()
};
