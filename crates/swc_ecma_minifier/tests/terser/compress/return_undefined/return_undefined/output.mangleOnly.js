function a() {}
function b() {
    return undefined;
}
function c() {
    return void 0;
}
function d() {
    return void 123;
}
function e() {
    return;
}
function f(a, b) {
    console.log(a, b);
    baz(a);
    return;
}
function g(a, b) {
    console.log(a, b);
    if (a) {
        foo(b);
        baz(a);
        return a + b;
    }
    return undefined;
}
function h(a, b) {
    console.log(a, b);
    if (a) {
        foo(b);
        baz(a);
        return void 0;
    }
    return a + b;
}
function i(a, b) {
    foo(a);
    bar(b);
    return void 0;
}
function j(a, b) {
    foo(a);
    bar(b);
    return undefined;
}
function k() {
    return false;
}
function l() {
    return null;
}
function m() {
    return 0;
}
