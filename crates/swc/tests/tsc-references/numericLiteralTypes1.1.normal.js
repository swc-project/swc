//// [numericLiteralTypes1.ts]
function f1() {
    var a = 1;
    var a = 1;
    var a = 1;
    var a = 1;
    var a = 1;
}
function f2() {
    var b = -1;
    var b = 0;
    var b = 1;
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
function f5(a, b) {
    var z1 = g(0);
    var z2 = g(1);
    var z3 = g(2);
    var z4 = g(a);
    var z5 = g(b);
}
function assertNever(x) {
    throw new Error("Unexpected value");
}
function f10(x) {
    switch(x){
        case 0:
            return "a";
        case 1:
            return "b";
        case 2:
            return "c";
    }
}
function f11(x) {
    switch(x){
        case 0:
            return "a";
        case 1:
            return "b";
        case 2:
            return "c";
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
    if (x === 0 || x === 2) {
        x;
    } else {
        x;
    }
}
function f14(x, y) {
    var a = x && y;
    var b = x || y;
}
function f15(x, y) {
    var a = x && y;
    var b = y && x;
    var c = x || y;
    var d = y || x;
    var e = !x;
    var f = !y;
}
function f20(x) {
    switch(x.kind){
        case 0:
            return x.a;
        case 1:
            return x.b;
        case 2:
            return x.c;
    }
}
function f21(x) {
    switch(x.kind){
        case 0:
            return x.a;
        case 1:
            return x.b;
        case 2:
            return x.c;
    }
    return assertNever(x);
}
