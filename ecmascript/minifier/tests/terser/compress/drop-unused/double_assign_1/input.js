function f1() {
    var a = {};
    var a = [];
    return a;
}
function f2() {
    var a = {};
    a = [];
    return a;
}
function f3() {
    a = {};
    var a = [];
    return a;
}
function f4(a) {
    a = {};
    a = [];
    return a;
}
function f5(a) {
    var a = {};
    a = [];
    return a;
}
function f6(a) {
    a = {};
    var a = [];
    return a;
}
console.log(f1(), f2(), f3(), f4(), f5(), f6());
