(function (x) {
    console.log(x() === eval("x"));
})(function f() {
    return f;
});
