function f3() {
    if ((a == 1) | (b == 2)) {
        foo();
    }
}
function f4() {
    if (!((a == 1) | (b == 2))) {
    } else {
        foo();
    }
}
function f5() {
    if (a == 1 && b == 2) {
        foo();
    }
}
function f6() {
    if (!(a == 1 && b == 2)) {
    } else {
        foo();
    }
}
function f7() {
    if (a == 1 || b == 2) {
        foo();
    } else {
        return bar();
    }
}
