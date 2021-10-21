function fn1() {
}
function fn2a() {
}
function fn2b() {
}
function fn3() {
    return null;
}
function fn6() {
}
function fn7() {
}
function fn8() {
}
function fn9() {
}
function fn10() {
}
function fn11() {
}
function fn12() {
}
//Function overloads that differ by accessibility
class cls {
    f() {
    }
    g() {
    }
}
//Function overloads with differing export
var M1;
(function(M) {
    function fn1() {
    }
    function fn2() {
    }
    M.fn2 = fn2;
})(M1 || (M1 = {
}));
function dfn1() {
}
function dfn2() {
}
function fewerParams(n) {
}
function fn13(n) {
}
function fn14() {
    return 3;
}
function fn15() {
    return undefined;
}
function initExpr() {
}
