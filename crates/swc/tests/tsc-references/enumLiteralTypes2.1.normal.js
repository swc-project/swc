//// [enumLiteralTypes2.ts]
;
function f1() {
    var a;
    var a;
    var a;
    var a;
}
function f2(a, b, c) {
    b = a;
    c = a;
    c = b;
}
function f3(a, b) {
    var x = a + b;
    var x = a - b;
    var x = a * b;
    var x = a / b;
    var x = a % b;
    var x = a | b;
    var x = a & b;
    var x = a ^ b;
    var x = -b;
    var x = ~b;
    var y = a == b;
    var y = a != b;
    var y = a === b;
    var y = a !== b;
    var y = a > b;
    var y = a < b;
    var y = a >= b;
    var y = a <= b;
    var y = !b;
}
function f4(a, b) {
    a++;
    b++;
}
function f5(a, b, c) {
    var z1 = g(1);
    var z2 = g(2);
    var z3 = g(a);
    var z4 = g(b);
    var z5 = g(c);
}
function assertNever(x) {
    throw new Error("Unexpected value");
}
function f10(x) {
    switch(x){
        case 1:
            return "true";
        case 2:
            return "false";
    }
}
function f11(x) {
    switch(x){
        case 1:
            return "true";
        case 2:
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
    if (x === 1) {
        x;
    } else {
        x;
    }
}
function f20(x) {
    switch(x.kind){
        case 1:
            return x.a;
        case 2:
            return x.b;
    }
}
function f21(x) {
    switch(x.kind){
        case 1:
            return x.a;
        case 2:
            return x.b;
    }
    return assertNever(x);
}
