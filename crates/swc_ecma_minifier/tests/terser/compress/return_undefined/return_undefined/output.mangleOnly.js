function n() {}
function r() {
    return undefined;
}
function u() {
    return void 0;
}
function t() {
    return void 123;
}
function o() {
    return;
}
function i(n, r) {
    console.log(n, r);
    baz(n);
    return;
}
function f(n, r) {
    console.log(n, r);
    if (n) {
        foo(r);
        baz(n);
        return n + r;
    }
    return undefined;
}
function e(n, r) {
    console.log(n, r);
    if (n) {
        foo(r);
        baz(n);
        return void 0;
    }
    return n + r;
}
function c(n, r) {
    foo(n);
    bar(r);
    return void 0;
}
function l(n, r) {
    foo(n);
    bar(r);
    return undefined;
}
function d() {
    return false;
}
function v() {
    return null;
}
function $() {
    return 0;
}
