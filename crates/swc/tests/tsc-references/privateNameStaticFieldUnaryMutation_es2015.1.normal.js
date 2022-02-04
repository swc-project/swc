function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
// @target: es2015
class C {
    test() {
        var _this_test, _this_test1, _this_test2, _this_test3, _this_test4;
        _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) + 1), _this_test;
        _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test1 = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) - 1), _this_test1;
        _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1);
        _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) - 1);
        const a = (_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test2 = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) + 1), _this_test2);
        const b = (_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test3 = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) - 1), _this_test3);
        const c = _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1);
        const d = _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) - 1);
        for(_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); _classStaticPrivateFieldSpecGet(this.getClass(), C, _test) < 10; _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test) + 1)){}
        for(_classStaticPrivateFieldSpecSet(this.getClass(), C, _test, 0); _classStaticPrivateFieldSpecGet(this.getClass(), C, _test) < 10; _classStaticPrivateFieldSpecSet(this.getClass(), C, _test, (_this_test4 = +_classStaticPrivateFieldSpecGet(this.getClass(), C, _test)) + 1), _this_test4){}
    }
    getClass() {
        return C;
    }
    constructor(){
        var _this_test, _this_test5, _this_test6, _this_test7, _this_test8;
        _classStaticPrivateFieldSpecSet(C, C, _test, (_this_test = +_classStaticPrivateFieldSpecGet(C, C, _test)) + 1), _this_test;
        _classStaticPrivateFieldSpecSet(C, C, _test, (_this_test5 = +_classStaticPrivateFieldSpecGet(C, C, _test)) - 1), _this_test5;
        _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1);
        _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) - 1);
        const a = (_classStaticPrivateFieldSpecSet(C, C, _test, (_this_test6 = +_classStaticPrivateFieldSpecGet(C, C, _test)) + 1), _this_test6);
        const b = (_classStaticPrivateFieldSpecSet(C, C, _test, (_this_test7 = +_classStaticPrivateFieldSpecGet(C, C, _test)) - 1), _this_test7);
        const c = _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1);
        const d = _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) - 1);
        for(_classStaticPrivateFieldSpecSet(C, C, _test, 0); _classStaticPrivateFieldSpecGet(C, C, _test) < 10; _classStaticPrivateFieldSpecSet(C, C, _test, +_classStaticPrivateFieldSpecGet(C, C, _test) + 1)){}
        for(_classStaticPrivateFieldSpecSet(C, C, _test, 0); _classStaticPrivateFieldSpecGet(C, C, _test) < 10; _classStaticPrivateFieldSpecSet(C, C, _test, (_this_test8 = +_classStaticPrivateFieldSpecGet(C, C, _test)) + 1), _this_test8){}
    }
}
var _test = {
    writable: true,
    value: 24
};
