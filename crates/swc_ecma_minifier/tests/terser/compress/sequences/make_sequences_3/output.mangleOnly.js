function a() {
    foo();
    bar();
    return baz();
}
function b() {
    foo();
    bar();
    throw new Error();
}
