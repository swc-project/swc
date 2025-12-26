//// [privateNameStaticMethodInStaticFieldInit.ts]
var __ = new WeakMap();
class C {
}
function method() {
    return 42;
}
__.set(C, {
    writable: true,
    value: C.s = method.call(C)
});
console.log(C.s);
