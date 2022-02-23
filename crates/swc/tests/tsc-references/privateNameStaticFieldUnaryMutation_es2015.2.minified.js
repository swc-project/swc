function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    var receiver, descriptor;
    return _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "set"), !function(receiver, descriptor, value) {
        if (descriptor.set) descriptor.set.call(receiver, value);
        else {
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        }
    }(receiver, descriptor, value), value;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class C {
    test() {
        var _this_test;
        for(_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1), _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) - 1), _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1), _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) - 1), _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1), _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) - 1), _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1), _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) - 1), _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); 10 > _classStaticPrivateFieldSpecGet(this.getClass(), C, _test); _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1));
        for(_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); 10 > _classStaticPrivateFieldSpecGet(this.getClass(), C, _test); _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) + 1), _this_test);
    }
    getClass() {
        return C;
    }
    constructor(){
        var _this_test;
        for(_classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1), _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) - 1), _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1), _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) - 1), _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1), _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) - 1), _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1), _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) - 1), _classStaticPrivateFieldSpecSet(C, C, _test, 0); 10 > _classStaticPrivateFieldSpecGet(C, C, _test); _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1));
        for(_classStaticPrivateFieldSpecSet(C, C, _test, 0); 10 > _classStaticPrivateFieldSpecGet(C, C, _test); _classStaticPrivateFieldSpecSet(C, C, _test, (_this_test = +_classStaticPrivateFieldSpecGet(C, C, _test)) + 1), _this_test);
    }
}
var _test = {
    writable: !0,
    value: 24
};
