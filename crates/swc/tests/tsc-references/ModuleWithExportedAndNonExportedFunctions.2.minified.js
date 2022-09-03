//// [ModuleWithExportedAndNonExportedFunctions.ts]
!function(A) {
    var fn = function(s) {
        return !0;
    }, fng = function(s) {
        return null;
    };
    A.fn = fn, A.fng = fng;
}(A || (A = {}));
var A, fn, fng, fn = A.fn, fng = A.fng, fn2 = A.fn2, fng2 = A.fng2;
