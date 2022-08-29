//// [ModuleWithExportedAndNonExportedFunctions.ts]
var A;
!function(A) {
    var fn = function(s) {
        return !0;
    }, fng = function(s) {
        return null;
    };
    A.fn = fn, A.fng = fng;
}(A || (A = {})), A.fn, A.fng, A.fn2, A.fng2;
