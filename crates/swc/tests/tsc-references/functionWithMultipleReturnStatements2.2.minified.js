//// [functionWithMultipleReturnStatements2.ts]
var a, b;
function f1() {
    return 1;
}
function f2() {
    return 1;
}
function f4() {
    try {
        return 1;
    } catch (e) {
        return;
    } finally{
        return 1;
    }
}
function f5() {
    return 1;
}
function f6(x) {
    return x;
}
function f9() {
    return a;
}
function f10() {
    return b;
}
function f11() {
    return function(x) {};
}
function f12() {
    return function(x) {};
}
