new (function(n) {
    this.foo = n;
})(1);
new (function(n) {
    this.foo = n;
})();
new (function n(_n) {
    this.foo = _n;
})(1);
new (function n(_n) {
    this.foo = _n;
})();
