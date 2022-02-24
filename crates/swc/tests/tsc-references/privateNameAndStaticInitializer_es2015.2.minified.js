function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
var _foo = new WeakMap(), _prop = new WeakMap();
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
A.inst = new A();
