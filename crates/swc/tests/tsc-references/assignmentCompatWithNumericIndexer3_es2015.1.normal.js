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
        var a;
        var b;
        a = b; // error
        b = a; // ok
        var b2;
        a = b2; // ok
        b2 = a; // ok
    }
})(Generics || (Generics = {}));
