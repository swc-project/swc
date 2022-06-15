var A;
(function(A) {
    var fn = function fn(s) {
        return true;
    };
    var fng = function fng(s) {
        return null;
    };
    var fn2 = function fn2(s) {
        return false;
    };
    var fng2 = function fng2(s) {
        return null;
    };
    A.fn = fn;
    A.fng = fng;
})(A || (A = {}));
// these should not be errors since the functions are exported
var fn;
var fn = A.fn;
var fng;
var fng = A.fng; // bug 838015
// these should be errors since the functions are not exported
var fn2 = A.fn2;
var fng2 = A.fng2;
