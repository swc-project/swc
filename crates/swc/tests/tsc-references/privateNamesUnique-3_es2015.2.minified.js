new WeakMap();
class B {
    test(x) {
        !function(receiver, classConstructor, descriptor) {
            if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
            return descriptor.value;
        }(x, B, _foo);
    }
}
var _foo = {
    writable: !0,
    value: !0
};
