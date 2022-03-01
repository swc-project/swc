new WeakMap();
class B {
    test(x) {
        var receiver, classConstructor, descriptor, receiver, descriptor;
        receiver = x, classConstructor = B, descriptor = _foo, (function(receiver, classConstructor) {
            if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
        })(receiver, classConstructor), (function(descriptor, action) {
            if (void 0 === descriptor) throw new TypeError("attempted to get private static field before its declaration");
        })(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
    }
}
var _foo = {
    writable: !0,
    value: !0
};
