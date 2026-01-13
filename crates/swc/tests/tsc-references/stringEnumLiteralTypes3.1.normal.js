//// [stringEnumLiteralTypes3.ts]
;
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
    a = "";
    a = "yes";
    a = "no";
    b = "";
    b = "yes";
    b = "no";
    c = "";
    c = "yes";
    c = "no";
    d = "";
    d = "yes";
    d = "no";
}
function f6(a, b, c, d) {
    a === "";
    a === "yes";
    a === "no";
    b === "";
    b === "yes";
    b === "no";
    c === "";
    c === "yes";
    c === "no";
    d === "";
    d === "yes";
    d === "no";
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
        case "":
            return x;
        case "yes":
            return x;
        case "no":
            return x;
    }
    return x;
}
function f11(x) {
    switch(x){
        case "":
            return x;
        case "yes":
            return x;
        case "no":
            return x;
    }
    return x;
}
function f12(x) {
    switch(x){
        case "":
            return x;
        case "yes":
            return x;
        case "no":
            return x;
    }
    return x;
}
function f13(x) {
    switch(x){
        case "":
            return x;
        case "yes":
            return x;
        case "no":
            return x;
    }
    return x;
}
