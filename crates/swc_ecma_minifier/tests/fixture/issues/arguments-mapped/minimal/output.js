(function(a, b) {
    var c = a;
    var d = b;
    var a = "foo";
    b++;
    a = "moo";
    b *= 2;
    console.log(a, b, c, d, a, b);
})("bar", 42);
(function(a, b) {
    var a;
    a++;
    console.log(a, a);
    b += 3;
    console.log(b, b);
    console.log(a++, ++b, a, b);
})(4, 5);
(function(a) {
    var a;
    class C {
        constructor(){
            console.log(arguments[0]);
        }
    }
    function nested() {
        console.log(arguments[0]);
    }
    new C("constructor");
    nested("function");
    a = 2;
    console.log(a, a);
})(1);
