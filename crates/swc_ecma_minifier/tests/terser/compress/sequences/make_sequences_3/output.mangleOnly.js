function o() {
    foo();
    bar();
    return baz();
}
function r() {
    foo();
    bar();
    throw new Error();
}
