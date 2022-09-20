function f(x) {
    pc = 200;
    return 100;
}
function x() {
    var t = f();
    return pc += t;
}
var pc = 0;
console.log(x());
