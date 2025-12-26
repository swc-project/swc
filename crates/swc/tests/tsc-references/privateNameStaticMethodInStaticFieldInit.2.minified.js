//// [privateNameStaticMethodInStaticFieldInit.ts]
var __ = new WeakMap();
class C {
}
__.set(C, {
    writable: !0,
    value: C.s = (function() {
        return 42;
    }).call(C)
}), console.log(C.s);
