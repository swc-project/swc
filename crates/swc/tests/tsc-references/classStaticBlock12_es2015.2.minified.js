class C {
}
var _x = {
    writable: !0,
    value: 1
};
(()=>{
    var receiver, classConstructor, descriptor, receiver, descriptor;
    receiver = C, classConstructor = C, descriptor = _x, (function(receiver, classConstructor) {
        if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    })(receiver, classConstructor), (function(descriptor, action) {
        if (void 0 === descriptor) throw new TypeError("attempted to get private static field before its declaration");
    })(descriptor, "get"), (descriptor = descriptor).get ? descriptor.get.call(receiver) : descriptor.value;
})();
