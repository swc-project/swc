// @strictNullChecks: true
function f1() {
    var a;
    var a;
    var a;
    var a;
}
function f2(a, b) {
    a = b;
    b = a;
}
function f3(a, b) {
    var x = a || b;
    var x = a && b;
    var x = !a;
}
function f4(t, f) {
    var x1 = t && f;
    var x2 = f && t;
    var x3 = t || f;
    var x4 = f || t;
    var x5 = !t;
    var x6 = !f;
}
function f5(b) {
    var z1 = g(true);
    var z2 = g(false);
    var z3 = g(b);
}
function assertNever(x) {
    throw new Error("Unexpected value");
}
function f10(x) {
    switch(x){
        case true:
            return "true";
        case false:
            return "false";
    }
}
function f11(x) {
    switch(x){
        case true:
            return "true";
        case false:
            return "false";
    }
    return assertNever(x);
}
function f12(x) {
    if (x) {
        x;
    } else {
        x;
    }
}
function f13(x) {
    if (x === true) {
        x;
    } else {
        x;
    }
}
function f20(x) {
    switch(x.kind){
        case true:
            return x.a;
        case false:
            return x.b;
    }
}
function f21(x) {
    switch(x.kind){
        case true:
            return x.a;
        case false:
            return x.b;
    }
    return assertNever(x);
}
