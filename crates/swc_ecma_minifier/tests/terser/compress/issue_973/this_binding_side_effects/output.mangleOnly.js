(function (o) {
    (0, o)();
    (0, o.bar)();
    (0, eval)("console.log(foo);");
})();
(function (o) {
    var n = console;
    (0, o)();
    (0, o.bar)();
    (0, n)("console.log(foo);");
})();
