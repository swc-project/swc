(function f0() {
    console.log(-3);
    eval("console.log(a);");
})();
(function f1() {
    var o = {
        a: 1
    }, a = 2;
    with (o)console.log(a);
})();
(function f2() {
    var o = {
        a: 1
    }, a = 2;
    return function() {
        with (o)console.log(a);
    };
})()();
