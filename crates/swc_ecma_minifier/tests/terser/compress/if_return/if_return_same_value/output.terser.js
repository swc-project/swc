function f() {
    return foo || bar ? x() : void 0;
}
function g() {
    return foo || bar, x();
}
function h() {
    return foo || bar ? x() : y();
}
