function c() {
    if ((a == 1) | (b == 2)) {
        foo();
    }
}
function d() {
    if (!((a == 1) | (b == 2))) {} else {
        foo();
    }
}
function e() {
    if (a == 1 && b == 2) {
        foo();
    }
}
function f() {
    if (!(a == 1 && b == 2)) {} else {
        foo();
    }
}
function g() {
    if (a == 1 || b == 2) {
        foo();
    } else {
        return bar();
    }
}
