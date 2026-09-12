function f(a, b) {
    return b;
}
let x = true;
function dec() {
    x = false;
}
x ? f(class {
    @dec
    m() {}
}, 1) : f(class {
    @dec
    m() {}
}, 2);
