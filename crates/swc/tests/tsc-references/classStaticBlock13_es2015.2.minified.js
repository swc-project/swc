function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    return descriptor.value;
}
class C {
    foo() {
        return _classStaticPrivateFieldSpecGet(C, C, _x);
    }
}
var _x = {
    writable: !0,
    value: 123
};
console.log(_classStaticPrivateFieldSpecGet(C, C, _x));
