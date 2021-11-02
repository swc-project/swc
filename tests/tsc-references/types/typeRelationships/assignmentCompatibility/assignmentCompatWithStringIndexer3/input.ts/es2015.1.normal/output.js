var a1;
var b1;
a1 = b1; // error
b1 = a1; // error
var Generics;
(function(Generics) {
    class A {
    }
    function foo() {
        var a;
        var b;
        a = b; // error
        b = a; // error
    }
})(Generics || (Generics = {
}));
