//// [covariantCallbacks.ts]
// Test that callback parameters are related covariantly
function f1(a, b) {
    a = b;
    b = a; // Error
}
function f2(a, b) {
    a = b;
    b = a; // Error
}
function f11(a, b) {
    a = b;
    b = a; // Error
}
function f12(a, b) {
    a = b;
    b = a; // Error
}
function f13(a, b) {
    a = b;
    b = a; // Error
}
function f14(a, b) {
    a = b;
    b = a; // Error
}
bu = bs;
bs = bu;
bfu = bfs;
bfs = bfu;
b1fu = b2fs;
b2fs = b1fu;
sx = sy; // Error
sy = sx;
s1 = s2; // Error
s2 = s1;
