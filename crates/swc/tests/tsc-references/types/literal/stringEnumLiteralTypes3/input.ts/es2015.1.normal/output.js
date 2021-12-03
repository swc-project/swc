var Choice;
(function(Choice1) {
    Choice1["Unknown"] = "";
    Choice1["Yes"] = "yes";
    Choice1["No"] = "no";
})(Choice || (Choice = {
}));
function f1(a, b, c, d) {
    a = a;
    a = b;
    a = c;
    a = d;
}
function f2(a, b, c, d) {
    b = a;
    b = b;
    b = c;
    b = d;
}
function f3(a, b, c, d) {
    c = a;
    c = b;
    c = c;
    c = d;
}
function f4(a, b, c, d) {
    d = a;
    d = b;
    d = c;
    d = d;
}
function f5(a, b, c, d) {
    a = Choice.Unknown;
    a = Choice.Yes;
    a = Choice.No;
    b = Choice.Unknown;
    b = Choice.Yes;
    b = Choice.No;
    c = Choice.Unknown;
    c = Choice.Yes;
    c = Choice.No;
    d = Choice.Unknown;
    d = Choice.Yes;
    d = Choice.No;
}
function f6(a, b, c, d) {
    a === Choice.Unknown;
    a === Choice.Yes;
    a === Choice.No;
    b === Choice.Unknown;
    b === Choice.Yes;
    b === Choice.No;
    c === Choice.Unknown;
    c === Choice.Yes;
    c === Choice.No;
    d === Choice.Unknown;
    d === Choice.Yes;
    d === Choice.No;
}
function f7(a, b, c, d) {
    a === a;
    a === b;
    a === c;
    a === d;
    b === a;
    b === b;
    b === c;
    b === d;
    c === a;
    c === b;
    c === c;
    c === d;
    d === a;
    d === b;
    d === c;
    d === d;
}
function f10(x) {
    switch(x){
        case Choice.Unknown:
            return x;
        case Choice.Yes:
            return x;
        case Choice.No:
            return x;
    }
    return x;
}
function f11(x) {
    switch(x){
        case Choice.Unknown:
            return x;
        case Choice.Yes:
            return x;
        case Choice.No:
            return x;
    }
    return x;
}
function f12(x) {
    switch(x){
        case Choice.Unknown:
            return x;
        case Choice.Yes:
            return x;
        case Choice.No:
            return x;
    }
    return x;
}
function f13(x) {
    switch(x){
        case Choice.Unknown:
            return x;
        case Choice.Yes:
            return x;
        case Choice.No:
            return x;
    }
    return x;
}
