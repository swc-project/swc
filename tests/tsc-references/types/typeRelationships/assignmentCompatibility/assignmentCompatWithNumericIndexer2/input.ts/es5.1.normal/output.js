var a1;
var b1;
a1 = b1;
b1 = a1; // error
var b21;
a1 = b21;
b21 = a1; // error
var Generics;
(function(Generics) {
    var foo = function foo() {
        var a;
        var b;
        a = b; // error
        b = a; // error
        var b2;
        a = b2; // error
        b2 = a; // error
        var b3;
        a = b3; // ok
        b3 = a; // ok
    };
})(Generics || (Generics = {
}));
