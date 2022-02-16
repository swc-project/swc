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
// @target: es2015
let friendA;
class A {
    getX() {
        return _classPrivateFieldGet(this, _x);
    }
    constructor(v){
        _x.set(this, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _x, v);
    }
}
var _x = new WeakMap();
var __ = {
    writable: true,
    value: (()=>{
        friendA = {
            getX (obj) {
                return _classPrivateFieldGet(obj, _x);
            },
            setX (obj, value) {
                _classPrivateFieldSet(obj, _x, value);
            }
        };
    })()
};
class B {
    constructor(a1){
        const x = friendA.getX(a1); // ok
        friendA.setX(a1, x + 1); // ok
    }
}
const a = new A(41);
const b = new B(a);
a.getX();
