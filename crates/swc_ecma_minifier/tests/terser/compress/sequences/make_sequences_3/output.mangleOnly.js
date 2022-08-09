function n() {
    foo();
    bar();
    return baz();
}
function t() {
    foo();
    bar();
    throw new Error();
}
