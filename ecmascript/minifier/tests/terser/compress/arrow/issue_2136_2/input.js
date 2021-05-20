function f(x) {
    console.log(x);
}
!(function (a, ...b) {
    f(b[0]);
})(1, 2, 3);
