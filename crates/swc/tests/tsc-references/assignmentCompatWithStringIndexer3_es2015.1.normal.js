var a;
var b1;
a = b1; // error
b1 = a; // error
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
})(Generics || (Generics = {}));
