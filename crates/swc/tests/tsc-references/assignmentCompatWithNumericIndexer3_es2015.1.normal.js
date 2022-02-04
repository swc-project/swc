class A {
}
var a;
var b;
a = b; // error
b = a; // ok
class B2 extends A {
}
var b2;
a = b2; // ok
b2 = a; // error
var Generics;
(function(Generics) {
    class A {
    }
    function foo() {
        var a1;
        var b1;
        a1 = b1; // error
        b1 = a1; // ok
        var b21;
        a1 = b21; // ok
        b21 = a1; // ok
    }
})(Generics || (Generics = {}));
