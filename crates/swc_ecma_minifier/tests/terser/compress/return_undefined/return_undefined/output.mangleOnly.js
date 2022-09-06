function n() {}
function o() {
    return undefined;
}
function u() {
    return void 0;
}
function r() {
    return void 123;
}
function t() {
    return;
}
function e(n, o) {
    console.log(n, o);
    baz(n);
    return;
}
function f(n, o) {
    console.log(n, o);
    if (n) {
        foo(o);
        baz(n);
        return n + o;
    }
    return undefined;
}
function i(n, o) {
    console.log(n, o);
    if (n) {
        foo(o);
        baz(n);
        return void 0;
    }
    return n + o;
}
function c(n, o) {
    foo(n);
    bar(o);
    return void 0;
}
function d(n, o) {
    foo(n);
    bar(o);
    return undefined;
}
function l() {
    return false;
}
function a() {
    return null;
}
function b() {
    return 0;
}
