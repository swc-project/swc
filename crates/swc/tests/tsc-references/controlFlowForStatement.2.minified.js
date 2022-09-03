//// [controlFlowForStatement.ts]
var cond;
function a() {
    for(; cond;);
}
function b() {
    var x;
    for(x = 5; cond; x = x.length)x = "";
}
function c() {
    var x;
    for(x = 5; x = x.toExponential(); x = 5);
}
function d() {
    var x;
    for(x = ""; "string" == typeof x; x = 5);
}
function e() {
    var x;
    for(x = 0; "string" != typeof x; x = !0);
}
function f() {
    for(var x; "string" != typeof x && "number" != typeof x;)x = void 0;
}
