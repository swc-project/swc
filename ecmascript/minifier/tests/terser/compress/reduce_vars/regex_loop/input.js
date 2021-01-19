function f(x) {
    for (var r, s = "acdabcdeabbb"; (r = x().exec(s)); ) console.log(r[0]);
}
var a = /ab*/g;
f(function () {
    return a;
});
