//// [stringLiteralTypesOverloadAssignability05.ts]
function f(x) {
    return 0;
}
function g(x) {
    return 0;
}
var a = f;
var b = g;
a = b;
b = a;
