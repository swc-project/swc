(function (x) {
    console.log(x() === eval("x"));
})(function n() {
    return n;
});
