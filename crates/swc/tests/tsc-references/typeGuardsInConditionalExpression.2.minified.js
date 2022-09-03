//// [typeGuardsInConditionalExpression.ts]
function foo(x) {
    return "string" == typeof x ? x.length : x++;
}
function foo2(x) {
    return "string" == typeof x ? (x = "hello", "hello") : x;
}
function foo3(x) {
    return "string" == typeof x ? (x = 10, 10) : x;
}
function foo4(x) {
    return "string" == typeof x ? x : (x = 10, 10);
}
function foo5(x) {
    return "string" == typeof x ? x : (x = "hello", "hello");
}
function foo6(x) {
    return "string" == typeof x ? (x = 10, 10) : (x = "hello", "hello");
}
function foo7(x) {
    return "string" == typeof x ? "hello" === x : "boolean" == typeof x ? x : 10 == x;
}
function foo8(x) {
    return "string" == typeof x ? "hello" === x : x && ("boolean" == typeof x ? x : 10 == x);
}
function foo9(x) {
    return "string" == typeof x ? x.length && "hello" === x : 10 === x;
}
function foo10(x) {
    return "string" == typeof x ? x : x && "number" == typeof x && x.toString();
}
function foo11(x) {
    return "string" == typeof x ? x : x && "number" == typeof x && (x = 10) && x;
}
function foo12(x) {
    return "string" == typeof x ? (x = 10).toString().length : x && "number" == typeof x && x;
}
