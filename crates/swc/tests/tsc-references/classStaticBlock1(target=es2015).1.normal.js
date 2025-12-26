//// [classStaticBlock1.ts]
const a = 2;
class C {
}
(()=>{
    const a = 1;
    a;
})();
