function f1(x) {
    return x ? -1 : -1;
}
function f2(x) {
    return x ? +2 : +2;
}
function f3(x) {
    return x ? ~3 : ~3;
}
function f4(x) {
    return x ? !4 : !4;
}
function f5(x) {
    return x ? void 5 : void 5;
}
function f6(x) {
    return x ? typeof 6 : typeof 6;
}
function g1() {
    return g() ? -1 : -1;
}
function g2() {
    return g() ? +2 : +2;
}
function g3() {
    return g() ? ~3 : ~3;
}
function g4() {
    return g() ? !4 : !4;
}
function g5() {
    return g() ? void 5 : void 5;
}
function g6() {
    return g() ? typeof 6 : typeof 6;
}
