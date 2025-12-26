//// [classStaticBlock2.ts]
const a = 1;
const b = 2;
class C {
}
(()=>{
    const a = 11;
    a;
    b;
})();
(()=>{
    const a = 11;
    a;
    b;
})();
