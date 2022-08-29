//// [classStaticBlock2.ts]
const a = 1;
const b = 2;
class C {
}
var __ = {
    writable: true,
    value: (()=>{
        const a = 11;
        a;
        b;
    })()
};
var __1 = {
    writable: true,
    value: (()=>{
        const a = 11;
        a;
        b;
    })()
};
