(function (foo) {
    foo();
    (0, foo.bar)();
    (0, eval)("console.log(foo);");
})();
(function (foo) {
    var eval = console;
    foo();
    (0, foo.bar)();
    (0, eval)("console.log(foo);");
})();
