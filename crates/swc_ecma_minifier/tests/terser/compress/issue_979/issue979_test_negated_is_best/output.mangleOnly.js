function f() {
    if ((a == 1) | (b == 2)) {
        foo();
    }
}
function o() {
    if (!((a == 1) | (b == 2))) {
    } else {
        foo();
    }
}
function n() {
    if (a == 1 && b == 2) {
        foo();
    }
}
function i() {
    if (!(a == 1 && b == 2)) {
    } else {
        foo();
    }
}
function e() {
    if (a == 1 || b == 2) {
        foo();
    } else {
        return bar();
    }
}
