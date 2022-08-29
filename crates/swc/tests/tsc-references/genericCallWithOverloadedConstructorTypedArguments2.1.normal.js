//// [genericCallWithOverloadedConstructorTypedArguments2.ts]
// Function typed arguments with multiple signatures must be passed an implementation that matches all of them
// Inferences are made quadratic-pairwise to and from these overload sets
var NonGenericParameter;
(function(NonGenericParameter) {
    var foo4 = function foo4(cb) {
        return cb;
    };
    var a;
    var b;
    var r3 = foo4(b); // ok
})(NonGenericParameter || (NonGenericParameter = {}));
var GenericParameter;
(function(GenericParameter) {
    var foo5 = function foo5(cb) {
        return cb;
    };
    var foo6 = function foo6(cb) {
        return cb;
    };
    var foo7 = function foo7(x, cb) {
        return cb;
    };
    var a;
    var r6 = foo5(a); // ok
    var b;
    var r10 = foo6(b); // error
    var r13 = foo7(1, a); // ok
    var c;
    var r14 = foo7(1, c); // ok
})(GenericParameter || (GenericParameter = {}));
