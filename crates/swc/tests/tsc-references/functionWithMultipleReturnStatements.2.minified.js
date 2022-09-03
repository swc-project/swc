//// [functionWithMultipleReturnStatements.ts]
function f1() {
    return 1;
}
function f2() {
    return 1;
}
function f3() {
    try {
        return 1;
    } catch (e) {
        return "";
    }
}
function f4() {
    try {
        return 1;
    } catch (e) {} finally{
        return "";
    }
}
function f5() {
    return 1;
}
function f6(x, y) {
    return x;
}
function f8(x, y) {
    return x;
}
