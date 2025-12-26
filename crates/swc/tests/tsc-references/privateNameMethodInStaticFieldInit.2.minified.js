//// [privateNameMethodInStaticFieldInit.ts]
var __ = new WeakMap(), _method = new WeakSet();
class C {
    constructor(){
        _method.add(this);
    }
}
__.set(C, {
    writable: !0,
    value: C.s = (function() {
        return 42;
    }).call(new C())
}), console.log(C.s);
