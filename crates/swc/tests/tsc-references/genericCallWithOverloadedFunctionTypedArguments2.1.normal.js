//// [genericCallWithOverloadedFunctionTypedArguments2.ts]
// Function typed arguments with multiple signatures must be passed an implementation that matches all of them
// Inferences are made quadratic-pairwise to and from these overload sets
(function(NonGenericParameter) {
    var a;
    function foo4(cb) {
        return cb;
    }
    var r3 = foo4(function(x) {
        var r;
        return r;
    }); // ok
})(NonGenericParameter || (NonGenericParameter = {}));
(function(GenericParameter) {
    function foo5(cb) {
        return cb;
    }
    var r6 = foo5(function(x) {
        return x;
    }); // ok
    function foo6(cb) {
        return cb;
    }
    var r10 = foo6(function(x, y) {
        return '';
    }); // error
    function foo7(x, cb) {
        return cb;
    }
    var r13 = foo7(1, function(x) {
        return x;
    }); // ok
    var a;
    var r14 = foo7(1, a); // ok
})(GenericParameter || (GenericParameter = {}));
var NonGenericParameter, GenericParameter;
