//// [genericCallWithOverloadedFunctionTypedArguments.ts]
// Function typed arguments with multiple signatures must be passed an implementation that matches all of them
// Inferences are made quadratic-pairwise to and from these overload sets
(function(NonGenericParameter) {
    var a;
    function foo4(cb) {
        return cb;
    }
    var r = foo4(a);
    var r2 = foo4(function(x) {
        return x;
    });
    var r4 = foo4(function(x) {
        return x;
    });
})(NonGenericParameter || (NonGenericParameter = {}));
(function(GenericParameter) {
    function foo5(cb) {
        return cb;
    }
    var r5 = foo5(function(x) {
        return x;
    }); // any => string (+1 overload) [inferences are made for T, but lambda not contextually typed]. T is any
    var a;
    var r7 = foo5(a); // any => string (+1 overload)
    function foo6(cb) {
        return cb;
    }
    var r8 = foo6(function(x) {
        return x;
    }); // any => string (+1 overload) [inferences are made for T, but lambda not contextually typed]. T is any
    var r9 = foo6(function(x) {
        return '';
    }); // any => string (+1 overload)
    var r11 = foo6(function(x, y) {
        return '';
    }); // any => string (+1 overload)
    function foo7(x, cb) {
        return cb;
    }
    var r12 = foo7(1, function(x) {
        return x;
    }); // any => string (+1 overload) [inferences are made for T, but lambda not contextually typed]
    var r13 = foo7(1, function(x) {
        return '';
    }); // any => string (+1 overload) [inferences are made for T, but lambda not contextually typed]
    var a;
    var r14 = foo7(1, a); // any => string (+1 overload) [inferences are made for T, but lambda not contextually typed]
})(GenericParameter || (GenericParameter = {}));
var NonGenericParameter, GenericParameter;
