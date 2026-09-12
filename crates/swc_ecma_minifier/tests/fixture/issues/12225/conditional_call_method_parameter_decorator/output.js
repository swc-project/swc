function f(a, b) {
    return b;
}
let x = true;
function dec() {
    x = false;
}
x ? f(class {
    m(
    @dec
    p) {}
}, 1) : f(class {
    m(
    @dec
    p) {}
}, 2);
