//// [typeGuardsInIfStatement.ts]
function foo(x) {
    return "string" == typeof x ? x.length : x++;
}
function foo2(x) {
    return "string" == typeof x ? x = 10 : x;
}
function foo3(x) {
    return "string" == typeof x ? x = "Hello" : x;
}
function foo4(x) {
    return "string" == typeof x ? x : x = 10;
}
function foo5(x) {
    return "string" == typeof x ? x : x = "hello";
}
function foo6(x) {
    return x = "string" == typeof x ? 10 : "hello";
}
function foo7(x) {
    return "string" == typeof x ? "hello" === x : "boolean" == typeof x ? x : 10 == x;
}
function foo8(x) {
    return "string" == typeof x ? "hello" === x : "boolean" == typeof x ? x : 10 == x;
}
function foo9(x) {
    return "string" == typeof x ? (x.length, "hello" === x) : 10 == x;
}
function foo10(x) {
    return "string" == typeof x ? "hello" === x : "number" == typeof x ? 10 === x : x;
}
function foo11(x) {
    return "string" == typeof x ? x : "number" == typeof x ? x = x.toString() : x && x.toString();
}
function foo12(x) {
    return "string" == typeof x ? x.toString() : (x = 10).toString();
}
