function a(a) {
    console.log(a);
}
!(function(b, ...c) {
    a(c[0]);
})(1, 2, 3);
