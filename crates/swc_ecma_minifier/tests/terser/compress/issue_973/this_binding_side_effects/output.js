(function(foo) {
    foo();
    foo.bar();
    eval("console.log(foo);");
})();
(function(foo) {
    var eval = console;
    foo();
    foo.bar();
    eval("console.log(foo);");
})();
