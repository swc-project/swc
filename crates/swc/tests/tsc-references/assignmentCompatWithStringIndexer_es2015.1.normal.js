class A {
}
var a;
var b;
a = b; // ok
b = a; // error
var b2;
a = b2; // ok
b2 = a; // error
var Generics;
(function(Generics) {
    class A {
    }
    class B extends A {
    }
    var b1;
    var a1;
    a1 = b1; // ok
    b1 = a1; // error
    class B2 extends A {
    }
    var b2;
    a1 = b2; // ok
    b2 = a1; // error
    function foo() {
        var b3;
        var a3;
        a3 = b3; // error
        b3 = a3; // error
        var b4;
        a3 = b4; // error
        b4 = a3; // error
    }
})(Generics || (Generics = {}));
