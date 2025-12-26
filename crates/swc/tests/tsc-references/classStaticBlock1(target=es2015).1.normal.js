//// [classStaticBlock1.ts]
var __ = new WeakMap();
const a = 2;
class C {
}
__.set(C, {
    writable: true,
    value: (()=>{
        const a = 1;
        a;
    })()
});
