//// [stringLiteralTypesOverloadAssignability01.ts]
function f(x) {
    return 0;
}
function g(x) {
    return 0;
}
var a = f, b = g;
b = a = b;
