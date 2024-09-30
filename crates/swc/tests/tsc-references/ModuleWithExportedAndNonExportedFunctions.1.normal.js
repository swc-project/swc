//// [ModuleWithExportedAndNonExportedFunctions.ts]
(function(A) {
    function fn(s) {
        return true;
    }
    A.fn = fn;
    function fng(s) {
        return null;
    }
    A.fng = fng;
    function fn2(s) {
        return false;
    }
    function fng2(s) {
        return null;
    }
})(A || (A = {}));
// these should not be errors since the functions are exported
var fn;
var fn = A.fn;
var fng;
var fng = A.fng; // bug 838015
// these should be errors since the functions are not exported
var fn2 = A.fn2;
var fng2 = A.fng2;
var A;
