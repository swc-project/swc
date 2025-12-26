//// [privateNameMethodInStaticFieldInit.ts]
var __ = new WeakMap(), _method = new WeakSet();
class C {
    constructor(){
        _method.add(this);
    }
}
function method() {
    return 42;
}
__.set(C, {
    writable: true,
    value: C.s = method.call(new C())
});
console.log(C.s);
