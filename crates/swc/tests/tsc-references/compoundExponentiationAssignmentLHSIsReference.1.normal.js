//// [compoundExponentiationAssignmentLHSIsReference.ts]
var value;
// identifiers: variable and parameter
var x1;
x1 = Math.pow(x1, value);
function fn1(x2) {
    x2 = Math.pow(x2, value);
}
// property accesses
var x3;
var ref = x3.a;
x3.a = Math.pow(ref, value);
var ref1 = x3['a'];
x3['a'] = Math.pow(ref1, value);
// parentheses, the contained expression is reference
x1 = Math.pow(x1, value);
function fn2(x4) {
    x4 = Math.pow(x4, value);
}
var ref2 = x3.a;
x3.a = Math.pow(ref2, value);
var ref3 = x3['a'];
x3['a'] = Math.pow(ref3, value);
