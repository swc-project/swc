//// [typeOfThisInStaticMembers3.ts]
var __ = new WeakMap(), __2 = new WeakMap(), __1 = new WeakMap(), __21 = new WeakMap(), __3 = new WeakMap();
class C {
}
class D extends C {
}
__1.set(D, {
    writable: true,
    value: D.c = 2
});
__21.set(D, {
    writable: true,
    value: D.d = D.c + 1
});
__3.set(D, {
    writable: true,
    value: D.e = super.a + D.c + 1
});
