//// [classStaticBlock5.ts]
new WeakMap(), new WeakMap();
var __1 = new WeakMap(), __21 = new WeakMap(), __3 = new WeakMap();
class B {
}
class C extends B {
}
__1.set(C, {
    writable: !0,
    value: C.b = 3
}), __21.set(C, {
    writable: !0,
    value: C.c = super.a
}), __3.set(C, {
    writable: !0,
    value: void (C.b, super.b, super.a)
});
