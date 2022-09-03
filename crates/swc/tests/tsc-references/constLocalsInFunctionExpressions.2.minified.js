//// [constLocalsInFunctionExpressions.ts]
function f1() {
    getStringOrNumber();
}
function f2() {
    if ("string" != typeof getStringOrNumber()) return;
}
function f3() {
    getStringOrNumber();
}
function f4() {
    if ("string" != typeof getStringOrNumber()) return;
}
function f5() {
    getStringOrNumber();
}
