(function(foo) {
    (0, foo)();
    (0, foo.bar)();
    (0, eval)("console.log(foo);");
})();
(function(foo) {
    var eval = console;
    (0, foo)();
    (0, foo.bar)();
    (0, eval)("console.log(foo);");
})();
