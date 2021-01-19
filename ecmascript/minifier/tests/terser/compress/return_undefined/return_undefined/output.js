function f0() {}
function f1() {}
function f2() {}
function f3() {}
function f4() {}
function f5(a, b) {
    console.log(a, b);
    baz(a);
}
function f6(a, b) {
    console.log(a, b);
    if (a) {
        foo(b);
        baz(a);
        return a + b;
    }
}
function f7(a, b) {
    console.log(a, b);
    if (!a) return a + b;
    foo(b);
    baz(a);
}
function f8(a, b) {
    foo(a);
    bar(b);
}
function f9(a, b) {
    foo(a);
    bar(b);
}
function f10() {
    return !1;
}
function f11() {
    return null;
}
function f12() {
    return 0;
}
