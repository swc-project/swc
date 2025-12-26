//// [classStaticBlock2.ts]
var __ = new WeakMap(), __2 = new WeakMap();
const a = 1;
const b = 2;
class C {
}
__.set(C, {
    writable: true,
    value: (()=>{
        const a = 11;
        a;
        b;
    })()
});
__2.set(C, {
    writable: true,
    value: (()=>{
        const a = 11;
        a;
        b;
    })()
});
