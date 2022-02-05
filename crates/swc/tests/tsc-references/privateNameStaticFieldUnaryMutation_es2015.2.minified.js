function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    return descriptor.value;
}
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
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
