var A1;
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
