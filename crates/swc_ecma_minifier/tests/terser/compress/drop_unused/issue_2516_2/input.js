function foo() {
    function qux(x) {
        bar.call(null, x);
    }
    function bar(x) {
        var FOUR = 4;
        var trouble = x || never_called();
        var value = (FOUR - 1) * trouble;
        console.log(value == 6 ? "PASS" : value);
    }
    Baz = qux;
}
var Baz;
foo();
Baz(2);
