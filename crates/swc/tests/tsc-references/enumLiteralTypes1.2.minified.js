//// [enumLiteralTypes1.ts]
var Choice;
function f1() {}
function f2(a, b, c) {}
function f3(a, b) {}
function f4(a, b) {}
function f5(a, b, c) {
    g(1), g(2), g(a), g(b), g(c);
}
function assertNever(x) {
    throw Error("Unexpected value");
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
function f12(x) {}
function f13(x) {}
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
!function(Choice) {
    Choice[Choice.Unknown = 0] = "Unknown", Choice[Choice.Yes = 1] = "Yes", Choice[Choice.No = 2] = "No";
}(Choice || (Choice = {}));
