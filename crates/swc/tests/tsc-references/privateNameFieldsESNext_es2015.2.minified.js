function _classApplyDescriptorGet(receiver, descriptor) {
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) descriptor.set.call(receiver, value);
    else {
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        descriptor.value = value;
    }
}
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
var _a = new WeakMap(), _b = new WeakMap(), _something = new WeakMap();
class C {
    method() {
        var receiver, privateMap, value, descriptor;
        console.log(_classPrivateFieldGet(this, _a)), receiver = this, value = "hello", descriptor = _classExtractFieldDescriptor(receiver, privateMap = _a, "set"), _classApplyDescriptorSet(receiver, descriptor, value), console.log(_classPrivateFieldGet(this, _b));
    }
    static test() {
        var receiver, classConstructor, descriptor, receiver, classConstructor, descriptor, value;
        console.log((receiver = this, classConstructor = C, descriptor = _m, _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "get"), _classApplyDescriptorGet(receiver, descriptor))), console.log((receiver = this, classConstructor = C, descriptor = _x, value = "test", _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "set"), _classApplyDescriptorSet(receiver, descriptor, value), value));
    }
    constructor(){
        this.a = 123, _classPrivateFieldInit(this, _a, {
            writable: !0,
            value: 10
        }), this.c = "hello", _classPrivateFieldInit(this, _b, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldInit(this, _something, {
            writable: !0,
            value: ()=>1234
        });
    }
}
var _m = {
    writable: !0,
    value: "test"
}, _x = {
    writable: !0,
    value: void 0
};
