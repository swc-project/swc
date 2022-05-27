(function() {
    return -1.23;
})();
console.log((function c() {
    return "okay";
})());
console.log((function c(d, e, f) {
    return 123;
})());
console.log((function(d, e, c) {
    return c;
})());
console.log((function(c, d, e) {
    if (c) return d;
    return e;
})(1, 2, 3));
console.log((function(c, d) {
    return c * d;
})(2, 3));
console.log((function(c, d) {
    return c * d;
})(2, 3, a(), b()));
