//// [arrayTypeOfFunctionTypes2.ts]
// valid uses of arrays of function types
var x, x2, r = x[1];
new r(), r();
var r3 = x[1];
new r3(), new r3();
var r5 = x2[1];
new r5(), r5();
