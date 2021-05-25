(function (a) {
    while (a());
})(function f() {
    console.log(typeof f);
});
