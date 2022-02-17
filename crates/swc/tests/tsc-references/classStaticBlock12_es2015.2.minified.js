class C {
}
!function(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    return descriptor.value;
}(C, C, {
    writable: !0,
    value: 1
});
