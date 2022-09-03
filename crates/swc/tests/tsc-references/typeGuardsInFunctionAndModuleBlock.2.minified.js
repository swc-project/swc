//// [typeGuardsInFunctionAndModuleBlock.ts]
var m, m1;
function foo(x) {
    return "string" == typeof x ? x : x.toString();
}
function foo2(x) {
    return "string" == typeof x ? x : x.toString();
}
function foo3(x) {
    return "string" == typeof x ? x : x.toString();
}
function foo4(x) {
    return "string" == typeof x ? x : x.toString();
}
function foo5(x) {}
!function(m) {
    var x, m2;
    m2 || (m2 = {}), "string" == typeof x || x.toString();
}(m || (m = {})), function(m1) {
    var x, m2, m21;
    (m21 = m2 || (m2 = {})).m3 || (m21.m3 = {}), "string" == typeof x || x.toString();
}(m1 || (m1 = {}));
