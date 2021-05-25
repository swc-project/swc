function foo() {
    function bar(x) {
        var value = (4 - 1) * (x || never_called());
        console.log(6 == value ? "PASS" : value);
    }
    Baz = function (x) {
        bar.call(null, x);
    };
}
var Baz;
foo();
Baz(2);
