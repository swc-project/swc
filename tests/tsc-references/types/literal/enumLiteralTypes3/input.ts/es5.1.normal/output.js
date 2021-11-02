var Choice1;
(function(Choice) {
    Choice[Choice["Unknown"] = 0] = "Unknown";
    Choice[Choice["Yes"] = 1] = "Yes";
    Choice[Choice["No"] = 2] = "No";
})(Choice1 || (Choice1 = {
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
    a = Choice1.Unknown;
    a = Choice1.Yes;
    a = Choice1.No;
    b = Choice1.Unknown;
    b = Choice1.Yes;
    b = Choice1.No;
    c = Choice1.Unknown;
    c = Choice1.Yes;
    c = Choice1.No;
    d = Choice1.Unknown;
    d = Choice1.Yes;
    d = Choice1.No;
}
function f6(a, b, c, d) {
    a === Choice1.Unknown;
    a === Choice1.Yes;
    a === Choice1.No;
    b === Choice1.Unknown;
    b === Choice1.Yes;
    b === Choice1.No;
    c === Choice1.Unknown;
    c === Choice1.Yes;
    c === Choice1.No;
    d === Choice1.Unknown;
    d === Choice1.Yes;
    d === Choice1.No;
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
        case Choice1.Unknown:
            return x;
        case Choice1.Yes:
            return x;
        case Choice1.No:
            return x;
    }
    return x;
}
function f11(x) {
    switch(x){
        case Choice1.Unknown:
            return x;
        case Choice1.Yes:
            return x;
        case Choice1.No:
            return x;
    }
    return x;
}
function f12(x) {
    switch(x){
        case Choice1.Unknown:
            return x;
        case Choice1.Yes:
            return x;
        case Choice1.No:
            return x;
    }
    return x;
}
function f13(x) {
    switch(x){
        case Choice1.Unknown:
            return x;
        case Choice1.Yes:
            return x;
        case Choice1.No:
            return x;
    }
    return x;
}
