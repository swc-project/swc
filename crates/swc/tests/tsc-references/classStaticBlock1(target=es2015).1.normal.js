//// [classStaticBlock1.ts]
const a = 2;
class C {
}
var __ = {
    writable: true,
    value: (()=>{
        const a = 1;
        a;
    })()
};
