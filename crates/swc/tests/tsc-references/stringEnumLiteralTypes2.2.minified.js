//// [stringEnumLiteralTypes2.ts]
var Choice;
function f1() {}
function f2(a, b, c) {}
function f3(a, b) {}
function f5(a, b, c) {
    g("yes"), g("no"), g(a), g(b), g(c);
}
function assertNever(x) {
    throw Error("Unexpected value");
}
function f10(x) {
    switch(x){
        case "yes":
            return "true";
        case "no":
            return "false";
    }
}
function f11(x) {
    switch(x){
        case "yes":
            return "true";
        case "no":
            return "false";
    }
    return assertNever(x);
}
function f12(x) {}
function f13(x) {}
function f20(x) {
    switch(x.kind){
        case "yes":
            return x.a;
        case "no":
            return x.b;
    }
}
function f21(x) {
    switch(x.kind){
        case "yes":
            return x.a;
        case "no":
            return x.b;
    }
    return assertNever(x);
}
!function(Choice) {
    Choice.Unknown = "", Choice.Yes = "yes", Choice.No = "no";
}(Choice || (Choice = {}));
