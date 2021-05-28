function f0() {}
function f1() {
    return undefined;
}
function f2() {
    return void 0;
}
function f3() {
    return void 123;
}
function f4() {
    return;
}
function f5(a, b) {
    console.log(a, b);
    baz(a);
    return;
}
function f6(a, b) {
    console.log(a, b);
    if (a) {
        foo(b);
        baz(a);
        return a + b;
    }
    return undefined;
}
function f7(a, b) {
    console.log(a, b);
    if (a) {
        foo(b);
        baz(a);
        return void 0;
    }
    return a + b;
}
function f8(a, b) {
    foo(a);
    bar(b);
    return void 0;
}
function f9(a, b) {
    foo(a);
    bar(b);
    return undefined;
}
function f10() {
    return false;
}
function f11() {
    return null;
}
function f12() {
    return 0;
}
