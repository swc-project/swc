function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
class C {
    method() {
        console.log(_classPrivateFieldGet(this, _a)), (function(receiver, privateMap, value) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            var descriptor = privateMap.get(receiver);
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        })(this, _a, "hello"), console.log(_classPrivateFieldGet(this, _b));
    }
    static test() {
        console.log(function(receiver, classConstructor, descriptor) {
            if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
            return descriptor.value;
        }(this, C, _m)), console.log(function(receiver, classConstructor, descriptor, value) {
            if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            return descriptor.value = value, value;
        }(this, C, _x, "test"));
    }
    constructor(){
        _classPrivateFieldInit(this, _a, {
            writable: !0,
            value: 10
        }), _classPrivateFieldInit(this, _b, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldInit(this, _something, {
            writable: !0,
            value: ()=>1234
        }), this.a = 123, this.c = "hello";
    }
}
var _a = new WeakMap(), _b = new WeakMap(), _m = {
    writable: !0,
    value: "test"
}, _x = {
    writable: !0,
    value: void 0
}, _something = new WeakMap();
