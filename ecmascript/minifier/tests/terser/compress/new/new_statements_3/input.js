new (function (foo) {
    this.foo = foo;
})(1);
new (function (foo) {
    this.foo = foo;
})();
new (function test(foo) {
    this.foo = foo;
})(1);
new (function test(foo) {
    this.foo = foo;
})();
