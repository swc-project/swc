function f1() {
    var e = 7;
    var s = "abcdef";
    var i = 2;
    var eval = console.log.bind(console);
    var x = s.charAt(i++);
    var y = s.charAt(i++);
    var z = s.charAt(i++);
    eval(x, y, z, e);
}
function p1() {
    var a = foo(),
        b = bar(),
        eval = baz();
    return a + b + eval;
}
function p2() {
    var a = foo(),
        b = bar(),
        eval = baz;
    return a + b + eval();
}
(function f2(eval) {
    var a = 2;
    console.log(a - 5);
    eval("console.log(a);");
})(eval);
