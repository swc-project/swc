//// [controlFlowWhileStatement.ts]
var cond;
function a() {
    for(; cond;);
}
function b() {}
function c() {}
function d() {
    var x;
    for(x = ""; x = x.length;)x = "";
}
function e() {
    for(; cond;);
}
function f() {
    for(; cond && !cond;)if (cond) continue;
}
function g() {
    for(; !cond;)if (cond) continue;
}
function h1() {
    var x;
    for(x = ""; x > 1;)x = 1;
}
function h2() {
    var x;
    for(x = ""; cond;)x = len(x);
}
function h3() {
    var x;
    for(x = ""; cond;)x = len(x);
}
