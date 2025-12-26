//// [classStaticBlock5.ts]
var __ = new WeakMap(), __2 = new WeakMap(), __1 = new WeakMap(), __21 = new WeakMap(), __3 = new WeakMap();
class B {
}
class C extends B {
}
__1.set(C, {
    writable: true,
    value: C.b = 3
});
__21.set(C, {
    writable: true,
    value: C.c = super.a
});
__3.set(C, {
    writable: true,
    value: (()=>{
        C.b;
        super.b;
        super.a;
    })()
});
