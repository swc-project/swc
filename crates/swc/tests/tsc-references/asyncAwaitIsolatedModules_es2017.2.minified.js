//// [asyncAwaitIsolatedModules_es2017.ts]
var M;
let f4 = async function() {}, f5 = async function() {}, f6 = async function() {};
!function(M) {
    async function f1() {}
    M.f1 = f1;
}(M || (M = {}));
export { };
