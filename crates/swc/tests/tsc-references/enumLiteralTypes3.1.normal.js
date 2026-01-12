//// [enumLiteralTypes3.ts]
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
    a = 0;
    a = 1;
    a = 2;
    b = 0;
    b = 1;
    b = 2;
    c = 0;
    c = 1;
    c = 2;
    d = 0;
    d = 1;
    d = 2;
}
function f6(a, b, c, d) {
    a === 0;
    a === 1;
    a === 2;
    b === 0;
    b === 1;
    b === 2;
    c === 0;
    c === 1;
    c === 2;
    d === 0;
    d === 1;
    d === 2;
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
        case 0:
            return x;
        case 1:
            return x;
        case 2:
            return x;
    }
    return x;
}
function f11(x) {
    switch(x){
        case 0:
            return x;
        case 1:
            return x;
        case 2:
            return x;
    }
    return x;
}
function f12(x) {
    switch(x){
        case 0:
            return x;
        case 1:
            return x;
        case 2:
            return x;
    }
    return x;
}
function f13(x) {
    switch(x){
        case 0:
            return x;
        case 1:
            return x;
        case 2:
            return x;
    }
    return x;
}
