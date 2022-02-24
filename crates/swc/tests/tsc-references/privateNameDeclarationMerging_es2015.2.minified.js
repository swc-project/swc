function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = function(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver);
    }(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
var _x = new WeakMap();
class C {
    foo() {
        const c = new C();
        _classPrivateFieldGet(c, _x);
        const d = new C();
        _classPrivateFieldGet(d, _x);
    }
    constructor(){
        !function(obj, privateMap, value) {
            !function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            }(obj, privateMap), privateMap.set(obj, value);
        }(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
