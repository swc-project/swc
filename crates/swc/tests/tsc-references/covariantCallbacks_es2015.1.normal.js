// @target: es2015
// @strict: true
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
