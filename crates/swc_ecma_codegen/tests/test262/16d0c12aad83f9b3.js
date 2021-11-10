function a() {
}
function b() {
    return c;
}
function d() {
    return void 1;
}
function e() {
    return void 2;
}
function f() {
    return;
}
function g(h, i) {
    j.k(h, i);
    l(h);
    return;
}
function m(h, i) {
    j.k(h, i);
    if (h) {
        n(i);
        l(h);
        return h + i;
    }
    return c;
}
function o(h, i) {
    j.k(h, i);
    if (h) {
        n(i);
        l(h);
        return void 3;
    }
    return h + i;
}
function p(h, i) {
    n(h);
    q(i);
    return void 4;
}
function r(h, i) {
    n(h);
    q(i);
    return c;
}
function s() {
    return false;
}
function t() {
    return null;
}
function u() {
    return 5;
}
