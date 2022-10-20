(function(foo) {
    foo();
    (0, foo.bar)();
    (0, eval)("console.log(foo);");
})();
(function(foo) {
    var eval1 = console;
    foo();
    (0, foo.bar)();
    (0, eval1)("console.log(foo);");
})();
