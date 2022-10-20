(function(o) {
    (0, o)();
    (0, o.bar)();
    (0, eval)("console.log(foo);");
})();
(function(o) {
    var eval = console;
    (0, o)();
    (0, o.bar)();
    (0, eval)("console.log(foo);");
})();
