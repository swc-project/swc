function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    var receiver, descriptor;
    return _classCheckPrivateStaticAccess(receiver, classConstructor), !function(descriptor, action) {
        if (void 0 === descriptor) throw new TypeError("attempted to get private static field before its declaration");
    }(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
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
