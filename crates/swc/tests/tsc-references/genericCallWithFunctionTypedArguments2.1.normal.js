//// [genericCallWithFunctionTypedArguments2.ts]
// Generic functions used as arguments for function typed parameters are not used to make inferences from
// Using construct signature arguments, no errors expected
function foo(x) {
    return new x(null);
}
var i;
var i2;
var a;
var r = foo(i); // any
var r2 = foo(i); // string 
var r3 = foo(i2); // string
var r3b = foo(a); // any
function foo2(x, cb) {
    return new cb(x);
}
var r4 = foo2(1, i2); // error
var r4b = foo2(1, a); // any
var r5 = foo2(1, i); // any
var r6 = foo2('', i2); // string
function foo3(x, cb, y) {
    return new cb(x);
}
var r7 = foo3(null, i, ''); // any
var r7b = foo3(null, a, ''); // any
var r8 = foo3(1, i2, 1); // error
var r9 = foo3('', i2, ''); // string
