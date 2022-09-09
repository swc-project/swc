function a(a) {
    for (var c, n = "acdabcdeabbb"; (c = a().exec(n)); ) console.log(c[0]);
}
var c = /ab*/g;
a(function () {
    return c;
});
