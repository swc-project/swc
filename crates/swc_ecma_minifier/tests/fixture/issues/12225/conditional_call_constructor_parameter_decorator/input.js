function f(a, b) {
    return b;
}

let x = true;
function dec() {
    x = false;
}

x ? f(class { constructor(@dec p) {} }, 1) : f(class { constructor(@dec p) {} }, 2);
