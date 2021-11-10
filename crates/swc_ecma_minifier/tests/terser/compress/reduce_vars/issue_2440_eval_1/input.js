function foo() {
    return bar();
}
baz = { quux: foo };
exec = function () {
    return eval("foo()");
};
