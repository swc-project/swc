function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: !0,
            value: 1
        }), _classPrivateFieldInit(this, _prop, {
            writable: !0,
            value: 2
        });
    }
}
var _foo = new WeakMap(), _prop = new WeakMap();
A.inst = new A();
