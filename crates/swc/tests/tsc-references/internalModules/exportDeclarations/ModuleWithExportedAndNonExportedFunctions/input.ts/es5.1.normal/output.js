var A1;
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
})(A1 || (A1 = {
}));
// these should not be errors since the functions are exported
var fn1;
var fn1 = A1.fn;
var fng1;
var fng1 = A1.fng; // bug 838015
// these should be errors since the functions are not exported
var fn2 = A1.fn2;
var fng2 = A1.fng2;
