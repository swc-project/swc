//// [compoundExponentiationAssignmentLHSIsReference.ts]
x1 = Math.pow(x1, value);
var value, x1, x3, ref = x3.a;
x3.a = Math.pow(ref, value);
var ref1 = x3.a;
x3.a = Math.pow(ref1, value), x1 = Math.pow(x1, value);
var ref2 = x3.a;
x3.a = Math.pow(ref2, value);
var ref3 = x3.a;
x3.a = Math.pow(ref3, value);
