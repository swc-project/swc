var // @strictNullChecks: true
Choice;
(function(Choice) {
    Choice["Unknown"] = "";
    Choice["Yes"] = "yes";
    Choice["No"] = "no";
})(Choice || (Choice = {
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
function f5(a, b, c) {
    var z1 = g(Choice.Yes);
    var z2 = g(Choice.No);
    var z3 = g(a);
    var z4 = g(b);
    var z5 = g(c);
}
function assertNever(x) {
    throw new Error("Unexpected value");
}
function f10(x) {
    switch(x){
        case Choice.Yes:
            return "true";
        case Choice.No:
            return "false";
    }
}
function f11(x) {
    switch(x){
        case Choice.Yes:
            return "true";
        case Choice.No:
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
    if (x === Choice.Yes) {
        x;
    } else {
        x;
    }
}
function f20(x) {
    switch(x.kind){
        case Choice.Yes:
            return x.a;
        case Choice.No:
            return x.b;
    }
}
function f21(x) {
    switch(x.kind){
        case Choice.Yes:
            return x.a;
        case Choice.No:
            return x.b;
    }
    return assertNever(x);
}
