//// [genericCallWithGenericSignatureArguments3.ts]
// When a function expression is inferentially typed (section 4.9.3) and a type assigned to a parameter in that expression references type parameters for which inferences are being made, 
// the corresponding inferred type arguments to become fixed and no further candidate inferences are made for them.
function foo(x, a, b) {
    var r;
    return r;
}
var r1 = foo("", function(x) {
    return "";
}, function(x) {
    return null;
}); // any => any
var r1ii = foo("", function(x) {
    return "";
}, function(x) {
    return null;
}); // string => string
var r2 = foo("", function(x) {
    return "";
}, function(x) {
    return "";
}); // string => string
var r3 = foo(null, function(x) {
    return "";
}, function(x) {
    return "";
}); // Object => Object
var r4 = foo(null, function(x) {
    return "";
}, function(x) {
    return "";
}); // any => any
var r5 = foo(new Object(), function(x) {
    return "";
}, function(x) {
    return "";
}); // Object => Object
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
var F;
(function(F) {
    F[F["A"] = 0] = "A";
})(F || (F = {}));
var r6 = foo(E.A, function(x) {
    return E.A;
}, function(x) {
    return F.A;
}); // number => number 
function foo2(x, a, b) {
    var r;
    return r;
}
var r8 = foo2("", function(x) {
    return "";
}, function(x) {
    return null;
}); // string => string
var r9 = foo2(null, function(x) {
    return "";
}, function(x) {
    return "";
}); // any => any
var r10 = foo2(null, function(x) {
    return "";
}, function(x) {
    return "";
}); // Object => Object
var x;
var r11 = foo2(x, function(a1) {
    return function(n) {
        return 1;
    };
}, function(a2) {
    return 2;
}); // error
var r12 = foo2(x, function(a1) {
    return function(n) {
        return 1;
    };
}, function(a2) {
    return 2;
}); // error
