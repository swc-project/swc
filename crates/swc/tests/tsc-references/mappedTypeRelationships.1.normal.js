//// [mappedTypeRelationships.ts]
function f1(x, k) {
    return x[k];
}
function f2(x, k) {
    return x[k];
}
function f3(x, y, k) {
    x[k] = y[k];
    y[k] = x[k]; // Error
}
function f4(x, y, k) {
    x[k] = y[k];
    y[k] = x[k]; // Error
}
function f5(x, y, k) {
    x[k] = y[k]; // Error
    y[k] = x[k]; // Error
}
function f6(x, y, k) {
    x[k] = y[k]; // Error
    y[k] = x[k]; // Error
}
function f10(x, y, k) {
    x[k] = y[k]; // Error
    y[k] = x[k];
}
function f11(x, y, k) {
    x[k] = y[k]; // Error
    y[k] = x[k];
}
function f12(x, y, k) {
    x[k] = y[k]; // Error
    y[k] = x[k]; // Error
}
function f13(x, y, k) {
    x[k] = y[k]; // Error
    y[k] = x[k]; // Error
}
function f20(x, y, k) {
    x[k] = y[k];
    y[k] = x[k]; // Error
}
function f21(x, y, k) {
    x[k] = y[k];
    y[k] = x[k]; // Error
}
function f22(x, y, k) {
    x[k] = y[k];
    y[k] = x[k]; // Error
}
function f23(x, y, k) {
    x[k] = y[k];
    y[k] = x[k]; // Error
}
function f30(x, y) {
    x = y; // Error
    y = x;
}
function f31(x, y) {
    x = y;
    y = x; // Error
}
function f40(x, y) {
    x = y;
    y = x;
}
function f41(x, y) {
    x = y;
    y = x; // Error
}
function f50(obj, key) {
    var item = obj[key];
    return obj[key].name;
}
function f51(obj, key) {
    var item = obj[key];
    return obj[key].name;
}
function f60(x, y) {
    x = y;
    y = x;
}
function f61(x, y) {
    x = y; // Error
    y = x;
}
function f62(x, y) {
    x = y;
    y = x;
}
function f70(x, y) {
    x = y;
    y = x;
}
function f71(x, y) {
    x = y;
    y = x; // Error
}
function f72(x, y) {
    x = y;
    y = x; // Error
}
function f73(x, y) {
    x = y;
    y = x; // Error
}
function f74(x, y) {
    x = y;
    y = x; // Error
}
function f75(x, y) {
    x = y;
    y = x; // Error
}
function f76(x, y) {
    x = y;
    y = x; // Error
}
function f80(t) {
    return t;
}
function f81(t, k) {
    return t[k];
}
function f82(t, k1, k2) {
    return t[k1][k2];
}
function f90() {
    var n = {
        x: 1
    };
}
function f() {
    return undefined;
}
