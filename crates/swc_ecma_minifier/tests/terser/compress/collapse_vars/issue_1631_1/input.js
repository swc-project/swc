var pc = 0;
function f(x) {
    pc = 200;
    return 100;
}
function x() {
    var t = f();
    pc += t;
    return pc;
}
console.log(x());
