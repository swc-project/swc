// @allowUnreachableCode: true
var x;
var cond;
x = /a/;
if (x /* RegExp */ , x = true) {
    x; // boolean
    x = "";
} else {
    x; // boolean
    x = 42;
}
x; // string | number
function a() {
    var x1;
    if (cond) {
        x1 = 42;
    } else {
        x1 = "";
        return;
    }
    x1; // number
}
function b() {
    var x2;
    if (cond) {
        x2 = 42;
        throw "";
    } else {
        x2 = "";
    }
    x2; // string
}
function c(data) {
    if (typeof data === "string") {
        return JSON.parse(data);
    } else {
        return data;
    }
}
function d(data) {
    if (typeof data === "string") {
        throw new Error("will always happen");
    } else {
        return data;
    }
}
function e(x3) {
    if (x3.p === "A") {
        var a = null;
    }
}
