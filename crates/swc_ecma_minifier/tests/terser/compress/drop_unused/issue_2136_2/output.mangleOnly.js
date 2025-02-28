function n(n) {
    console.log(n);
}
!(function(c, ...o) {
    n(o[0]);
})(1, 2, 3);
