function n(n) {
    console.log(n);
}
!(function(o, ...c) {
    n(c[0]);
})(1, 2, 3);
