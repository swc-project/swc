function f1(x) {
    return -1;
}
function f2(x) {
    return 2;
}
function f3(x) {
    return -4;
}
function f4(x) {
    return !1;
}
function f5(x) {
    return;
}
function f6(x) {
    return "number";
}
function g1() {
    return g(), -1;
}
function g2() {
    return g(), 2;
}
function g3() {
    return g(), -4;
}
function g4() {
    return g(), !1;
}
function g5() {
    return void g();
}
function g6() {
    return g(), "number";
}
