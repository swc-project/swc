var a;
var b;
a = b;
b = a; // error
var b2;
a = b2;
b2 = a; // error
var Generics;
(function(Generics) {
    function foo() {
        var a1;
        var b1;
        a1 = b1; // error
        b1 = a1; // error
        var b21;
        a1 = b21; // error
        b21 = a1; // error
        var b3;
        a1 = b3; // ok
        b3 = a1; // ok
    }
})(Generics || (Generics = {}));
