class C {
}
!function(receiver, classConstructor, descriptor) {
    var receiver, descriptor;
    return (function(receiver, classConstructor) {
        if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    })(receiver, classConstructor), !function(descriptor, action) {
        if (void 0 === descriptor) throw new TypeError("attempted to get private static field before its declaration");
    }(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}(C, C, {
    writable: !0,
    value: 1
});
