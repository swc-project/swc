var a = 42;
!(function (a) {
    console.log(a());
})(function () {
    return a;
});
