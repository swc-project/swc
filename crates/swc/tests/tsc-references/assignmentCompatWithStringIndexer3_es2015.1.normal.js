var a;
var b1;
a = b1; // error
b1 = a; // error
var Generics;
(function(Generics) {
    class A {
    }
    function foo() {
        var a1;
        var b;
        a1 = b; // error
        b = a1; // error
    }
})(Generics || (Generics = {}));
