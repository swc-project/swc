//// [enumLiteralTypes3.ts]
var Choice;
function f1(a, b, c, d) {}
function f2(a, b, c, d) {}
function f3(a, b, c, d) {}
function f4(a, b, c, d) {}
function f5(a, b, c, d) {}
function f6(a, b, c, d) {}
function f7(a, b, c, d) {}
function f10(x) {
    return x;
}
function f11(x) {
    return x;
}
function f12(x) {
    return x;
}
function f13(x) {
    return x;
}
!function(Choice) {
    Choice[Choice.Unknown = 0] = "Unknown", Choice[Choice.Yes = 1] = "Yes", Choice[Choice.No = 2] = "No";
}(Choice || (Choice = {}));
