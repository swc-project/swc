function f1() {
    var e = 7,
        s = "abcdef",
        i = 2,
        eval = console.log.bind(console),
        x = s.charAt(i++),
        y = s.charAt(i++),
        z = s.charAt(i++);
    eval(x, y, z, e);
}
function p1() {
    return foo() + bar() + baz();
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
