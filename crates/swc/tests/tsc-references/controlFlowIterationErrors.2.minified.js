//// [controlFlowIterationErrors.ts]
var cond;
function len(s) {
    return s.length;
}
function f1() {
    var x;
    for(x = ""; cond;)x = len(x);
}
function f2() {
    var x;
    for(x = ""; cond;)x = len(x);
}
function g1() {
    var x;
    for(x = ""; cond;)x = foo(x);
}
function g2() {
    var x;
    for(x = ""; cond;)x = foo(x);
}
function asNumber(x) {
    return +x;
}
function h1() {
    var x;
    for(x = "0"; cond;)x = +x + 1;
}
function h2() {
    var x;
    for(x = "0"; cond;)x = asNumber(x) + 1;
}
function h3() {
    var x;
    for(x = "0"; cond;)x = asNumber(x) + 1;
}
function h4() {
    var x;
    for(x = "0"; cond;)x = asNumber(x) + 1;
}
