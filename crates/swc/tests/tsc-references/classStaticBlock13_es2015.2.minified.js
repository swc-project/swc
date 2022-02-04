class C {
    foo() {
        return (function(receiver, classConstructor, descriptor) {
            if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
            return descriptor.value;
        })(C, C, _x);
    }
}
var _x = {
    writable: !0,
    value: 123
};
console.log(C.#x);
