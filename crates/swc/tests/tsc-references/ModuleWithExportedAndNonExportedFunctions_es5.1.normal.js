var A;
(function(A1) {
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
    A1.fn = fn;
    A1.fng = fng;
})(A || (A = {}));
// these should not be errors since the functions are exported
var fn1;
var fn1 = A.fn;
var fng1;
var fng1 = A.fng; // bug 838015
// these should be errors since the functions are not exported
var fn2 = A.fn2;
var fng2 = A.fng2;
