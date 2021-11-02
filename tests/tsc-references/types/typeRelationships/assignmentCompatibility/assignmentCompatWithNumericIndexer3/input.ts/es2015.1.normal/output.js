class A {
}
var a1;
var b1;
a1 = b1; // error
b1 = a1; // ok
class B2 extends A {
}
var b21;
a1 = b21; // ok
b21 = a1; // error
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
})(Generics || (Generics = {
}));
