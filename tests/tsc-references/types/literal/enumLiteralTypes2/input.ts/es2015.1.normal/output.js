var // @strictNullChecks: true
Choice1;
(function(Choice) {
    Choice[Choice["Unknown"] = 0] = "Unknown";
    Choice[Choice["Yes"] = 1] = "Yes";
    Choice[Choice["No"] = 2] = "No";
})(Choice1 || (Choice1 = {
}));
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
    var z1 = g(Choice1.Yes);
    var z2 = g(Choice1.No);
    var z3 = g(a);
    var z4 = g(b);
    var z5 = g(c);
}
function assertNever(x) {
    throw new Error("Unexpected value");
}
function f10(x) {
    switch(x){
        case Choice1.Yes:
            return "true";
        case Choice1.No:
            return "false";
    }
}
function f11(x) {
    switch(x){
        case Choice1.Yes:
            return "true";
        case Choice1.No:
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
    if (x === Choice1.Yes) {
        x;
    } else {
        x;
    }
}
function f20(x) {
    switch(x.kind){
        case Choice1.Yes:
            return x.a;
        case Choice1.No:
            return x.b;
    }
}
function f21(x) {
    switch(x.kind){
        case Choice1.Yes:
            return x.a;
        case Choice1.No:
            return x.b;
    }
    return assertNever(x);
}
