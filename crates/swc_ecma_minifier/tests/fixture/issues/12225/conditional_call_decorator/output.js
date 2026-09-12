function f(a, b) {
    return b;
}
let x = true;
function dec(C) {
    x = false;
    return C;
}
x ? f(@dec
class {
}, 1) : f(@dec
class {
}, 2);
