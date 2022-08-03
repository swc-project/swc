new (function(n) {
    this.foo = n;
})(1);
new (function(n) {
    this.foo = n;
})();
new (function n(o) {
    this.foo = o;
})(1);
new (function n(o) {
    this.foo = o;
})();
