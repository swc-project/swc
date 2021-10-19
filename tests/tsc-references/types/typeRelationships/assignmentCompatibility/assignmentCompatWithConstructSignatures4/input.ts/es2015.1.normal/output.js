// checking assignment compatibility relations for function types.
var Errors;
(function(Errors) {
    class Base {
    }
    class Derived extends Base {
    }
    class Derived2 extends Derived {
    }
    class OtherDerived extends Base {
    }
    var WithNonGenericSignaturesInBaseType;
    (function(WithNonGenericSignaturesInBaseType) {
        // target type with non-generic call signatures
        var a2;
        var a7;
        var a8;
        var a10;
        var a11;
        var a12;
        var a14;
        var a15;
        var a16;
        var a17;
        var b2;
        a2 = b2; // ok
        b2 = a2; // ok
        var b7;
        a7 = b7; // ok
        b7 = a7; // ok
        var b8;
        a8 = b8; // error, type mismatch
        b8 = a8; // error
        var b10;
        a10 = b10; // ok
        b10 = a10; // ok
        var b11;
        a11 = b11; // ok
        b11 = a11; // ok
        var b12;
        a12 = b12; // ok
        b12 = a12; // ok
        var b15;
        a15 = b15; // ok
        b15 = a15; // ok
        var b15a;
        a15 = b15a; // ok
        b15a = a15; // ok
        var b16;
        a16 = b16; // error
        b16 = a16; // error
        var b17;
        a17 = b17; // error
        b17 = a17; // error
    })(WithNonGenericSignaturesInBaseType || (WithNonGenericSignaturesInBaseType = {
    }));
    var WithGenericSignaturesInBaseType;
    (function(WithGenericSignaturesInBaseType) {
        // target type has generic call signature
        var a2;
        var b2;
        a2 = b2; // ok
        b2 = a2; // ok
        // target type has generic call signature
        var a3;
        var b3;
        a3 = b3; // ok
        b3 = a3; // ok
    })(WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {
    }));
})(Errors || (Errors = {
}));
