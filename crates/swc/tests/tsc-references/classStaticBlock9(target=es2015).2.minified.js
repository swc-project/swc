//// [classStaticBlock9.ts]
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap();
class A {
}
__.set(A, {
    writable: !0,
    value: A.bar = A.foo + 1
}), __2.set(A, {
    writable: !0,
    value: A.foo + 2
}), __3.set(A, {
    writable: !0,
    value: A.foo = 1
});
