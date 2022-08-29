//// [controlFlowIterationErrors.ts]
var cond;
function len(s) {
    return s.length;
}
function f1() {
    var x;
    x = "";
    while(cond){
        x = len(x);
        x;
    }
    x;
}
function f2() {
    var x;
    x = "";
    while(cond){
        x;
        x = len(x);
    }
    x;
}
function g1() {
    var x;
    x = "";
    while(cond){
        x = foo(x);
        x;
    }
    x;
}
function g2() {
    var x;
    x = "";
    while(cond){
        x;
        x = foo(x);
    }
    x;
}
function asNumber(x) {
    return +x;
}
function h1() {
    var x;
    x = "0";
    while(cond){
        x = +x + 1;
        x;
    }
}
function h2() {
    var x;
    x = "0";
    while(cond){
        x = asNumber(x) + 1;
        x;
    }
}
function h3() {
    var x;
    x = "0";
    while(cond){
        var y = asNumber(x);
        x = y + 1;
        x;
    }
}
function h4() {
    var x;
    x = "0";
    while(cond){
        x;
        var y = asNumber(x);
        x = y + 1;
        x;
    }
}
