//// [asyncAwaitIsolatedModules_es2017.ts]
!function(M1) {
    async function f1() {}
    M1.f1 = f1;
}(M = {});
export { };
