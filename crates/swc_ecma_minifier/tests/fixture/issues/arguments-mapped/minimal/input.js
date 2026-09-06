(function (a, b) {
    var c = arguments[0];
    var d = arguments[1];
    var a = "foo";
    b++;
    arguments[0] = "moo";
    arguments[1] *= 2;
    console.log(a, b, c, d, arguments[0], arguments[1]);
})("bar", 42);

(function (a, b) {
    var a;
    a++;
    console.log(a, arguments[0]);
    arguments[1] += 3;
    console.log(b, arguments[1]);
    console.log(arguments[0]++, ++arguments[1], a, b);
})(4, 5);

(function (a) {
    var a;
    class C {
        constructor() {
            console.log(arguments[0]);
        }
    }
    function nested() {
        console.log(arguments[0]);
    }
    new C("constructor");
    nested("function");
    arguments[0] = 2;
    console.log(a, arguments[0]);
})(1);
