//// [arrayTypeOfFunctionTypes.ts]
// valid uses of arrays of function types
var x;
var r = x[1];
var r2 = r();
var r2b = new r();
var x2;
var r3 = x2[1];
var r4 = r3();
var r4b = new r3(); // error
var x3;
var r5 = x2[1];
var r6 = r5();
var r6b = new r5(); // error
