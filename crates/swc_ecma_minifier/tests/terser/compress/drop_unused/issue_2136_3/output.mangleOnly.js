function a(a) {
    console.log(a);
}
!(function(c, ...b) {
    a(b[0]);
})(1, 2, 3);
