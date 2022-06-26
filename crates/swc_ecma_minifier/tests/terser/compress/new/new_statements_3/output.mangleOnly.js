new (function(a) {
    this.foo = a;
})(1);
new (function(a) {
    this.foo = a;
})();
new (function a(b) {
    this.foo = b;
})(1);
new (function a(b) {
    this.foo = b;
})();
