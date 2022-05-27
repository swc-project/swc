function a() {
    var a = {};
    var a = [];
    return a;
}
function b() {
    var a = {};
    a = [];
    return a;
}
function c() {
    a = {};
    var a = [];
    return a;
}
function d(a) {
    a = {};
    a = [];
    return a;
}
function e(a) {
    var a = {};
    a = [];
    return a;
}
function f(a) {
    a = {};
    var a = [];
    return a;
}
console.log(a(), b(), c(), d(), e(), f());
