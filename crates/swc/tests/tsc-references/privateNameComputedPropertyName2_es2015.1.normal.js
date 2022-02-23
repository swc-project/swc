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
// @target: esnext, es2022, es2015
let getX;
var tmp = (getX = (a)=>_classPrivateFieldGet(a, _x)
, "_");
class A {
    [tmp]() {}
    constructor(){
        _classPrivateFieldInit(this, _x, {
            writable: true,
            value: 100
        });
    }
}
var _x = new WeakMap();
console.log(getX(new A));
