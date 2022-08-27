//// [controlFlowForStatement.ts]
var cond;
function a() {
    var x;
    for(x = ""; cond; x = 5){
        x; // string | number
    }
}
function b() {
    var x;
    for(x = 5; cond; x = x.length){
        x; // number
        x = "";
    }
}
function c() {
    var x;
    for(x = 5; x = x.toExponential(); x = 5){
        x; // string
    }
}
function d() {
    var x;
    for(x = ""; typeof x === "string"; x = 5){
        x; // string
    }
}
function e() {
    var x;
    for(x = "" || 0; typeof x !== "string"; x = "" || true){
        x; // number | boolean
    }
}
function f() {
    var x;
    for(; typeof x !== "string";){
        x; // number | boolean
        if (typeof x === "number") break;
        x = undefined;
    }
    x; // string | number
}
