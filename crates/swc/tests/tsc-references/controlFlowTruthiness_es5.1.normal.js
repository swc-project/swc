// @strictNullChecks: true
function f1() {
    var x = foo();
    if (x) {
        x; // string
    } else {
        x; // string | undefined
    }
}
function f2() {
    var x;
    x = foo();
    if (x) {
        x; // string
    } else {
        x; // string | undefined
    }
}
function f3() {
    var x;
    if (x = foo()) {
        x; // string
    } else {
        x; // string | undefined
    }
}
function f4() {
    var x;
    if (!(x = foo())) {
        x; // string | undefined
    } else {
        x; // string
    }
}
function f5() {
    var x;
    var y;
    if (x = y = foo()) {
        x; // string
        y; // string | undefined
    } else {
        x; // string | undefined
        y; // string | undefined
    }
}
function f6() {
    var x;
    var y;
    if (x = foo(), y = foo()) {
        x; // string | undefined
        y; // string
    } else {
        x; // string | undefined
        y; // string | undefined
    }
}
function f7(x) {
    if (x) {
        x; // {}
    } else {
        x; // {}
    }
}
function f8(x) {
    if (x) {
        x; // {}
    } else {
        x; // {}
    }
}
function f9(x) {
    if (x) {
        x; // {}
    } else {
        x; // never
    }
}
