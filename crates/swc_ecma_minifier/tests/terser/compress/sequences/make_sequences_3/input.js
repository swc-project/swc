function f() {
    foo();
    bar();
    return baz();
}
function g() {
    foo();
    bar();
    throw new Error();
}
