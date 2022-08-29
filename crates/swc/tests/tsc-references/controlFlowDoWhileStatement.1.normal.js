//// [controlFlowDoWhileStatement.ts]
var cond;
function a() {
    var x;
    x = "";
    do {
        x; // string
    }while (cond);
}
function b() {
    var x;
    x = "";
    do {
        x; // string
        x = 42;
        break;
    }while (cond);
}
function c() {
    var x;
    x = "";
    do {
        x; // string
        x = undefined;
        if (typeof x === "string") continue;
        break;
    }while (cond);
}
function d() {
    var x;
    x = 1000;
    do {
        x; // number
        x = "";
    }while (x = x.length);
    x; // number
}
function e() {
    var x;
    x = "";
    do {
        x = 42;
    }while (cond);
    x; // number
}
function f() {
    var x;
    x = "";
    do {
        if (cond) {
            x = 42;
            break;
        }
        if (cond) {
            x = true;
            continue;
        }
        x = /a/;
    }while (cond);
    x; // number | boolean | RegExp
}
function g() {
    var x;
    x = "";
    do {
        if (cond) {
            x = 42;
            break;
        }
        if (cond) {
            x = true;
            continue;
        }
        x = /a/;
    }while (true);
    x; // number
}
