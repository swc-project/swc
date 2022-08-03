function n() {
    if ((a == 1) | (b == 2)) {
        foo();
    }
}
function f() {
    if (!((a == 1) | (b == 2))) {} else {
        foo();
    }
}
function i() {
    if (a == 1 && b == 2) {
        foo();
    }
}
function e() {
    if (!(a == 1 && b == 2)) {} else {
        foo();
    }
}
function t() {
    if (a == 1 || b == 2) {
        foo();
    } else {
        return bar();
    }
}
