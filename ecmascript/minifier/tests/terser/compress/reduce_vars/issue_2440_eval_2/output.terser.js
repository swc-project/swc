baz = { quux: foo };
exec = function () {
    return eval("foo()");
};
function foo() {
    return bar();
}
