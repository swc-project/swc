//// [controlFlowDoWhileStatement.ts]
var cond;
function a() {
    do ;
    while (cond);
}
function b() {
    do break;
    while (cond);
}
function c() {
    do break;
    while (cond);
}
function d() {
    var x;
    x = 1000;
    do x = "";
    while (x = x.length);
}
function e() {
    do ;
    while (cond);
}
function f() {
    do {
        if (cond) break;
        if (cond) continue;
    }while (cond);
}
function g() {
    for(; !cond;)if (cond) continue;
}
