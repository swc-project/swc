//// [typeGuardsDefeat.ts]
function foo(x) {
    return "string" == typeof x ? (x = 10).length : x++;
}
function foo2(x) {
    if ("string" == typeof x) return x.length;
    x = "hello";
}
function foo3(x) {
    if ("string" == typeof x) return x.length;
    x = "hello";
}
