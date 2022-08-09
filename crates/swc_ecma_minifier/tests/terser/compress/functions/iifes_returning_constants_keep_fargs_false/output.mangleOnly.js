(function() {
    return -1.23;
})();
console.log((function n() {
    return "okay";
})());
console.log((function n(r, t, u) {
    return 123;
})());
console.log((function(n, r, t) {
    return t;
})());
console.log((function(n, r, t) {
    if (n) return r;
    return t;
})(1, 2, 3));
console.log((function(n, r) {
    return n * r;
})(2, 3));
console.log((function(n, r) {
    return n * r;
})(2, 3, a(), b()));
