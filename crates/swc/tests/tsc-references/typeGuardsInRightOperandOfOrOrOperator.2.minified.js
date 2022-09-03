//// [typeGuardsInRightOperandOfOrOrOperator.ts]
function foo(x) {
    return "string" != typeof x || 10 === x.length;
}
function foo2(x) {
    return "string" != typeof x || (x = 10);
}
function foo3(x) {
    return "string" != typeof x || (x = "hello");
}
function foo4(x) {
    return "string" == typeof x || "number" == typeof x || x;
}
function foo5(x) {
    return "string" == typeof x || x || "number" == typeof x || x;
}
function foo6(x) {
    return "string" == typeof x || ("number" != typeof x ? x : 10 === x);
}
function foo7(x) {
    return "string" == typeof x || x || ("number" == typeof x ? (x = 10).toString() : x && x.toString());
}
