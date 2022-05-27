new (function(a) {
    this.foo = a;
})(1);
new (function(a) {
    this.foo = a;
})();
new (function b(a) {
    this.foo = a;
})(1);
new (function b(a) {
    this.foo = a;
})();
