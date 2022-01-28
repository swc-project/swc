var a = /ab*/g;
(function (x) {
    for (var r, s = "acdabcdeabbb"; (r = x().exec(s)); ) console.log(r[0]);
})(function () {
    return a;
});
