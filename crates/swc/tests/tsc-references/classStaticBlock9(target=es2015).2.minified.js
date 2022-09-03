//// [classStaticBlock9.ts]
class A {
}
A.bar = A.foo + 1;
var __ = {
    writable: !0,
    value: void A.foo
};
A.foo = 1;
