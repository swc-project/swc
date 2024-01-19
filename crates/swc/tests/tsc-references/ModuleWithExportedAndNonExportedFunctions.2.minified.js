//// [ModuleWithExportedAndNonExportedFunctions.ts]
var A, A1;
A1 = A || (A = {}), A1.fn = function(s) {
    return !0;
}, A1.fng = function(s) {
    return null;
}, A.fn, A.fng, A.fn2, A.fng2;
