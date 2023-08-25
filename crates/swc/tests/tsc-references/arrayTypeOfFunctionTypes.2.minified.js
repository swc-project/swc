//// [arrayTypeOfFunctionTypes.ts]
// valid uses of arrays of function types
var x2, r = (void 0)[1];
r(), new r();
var r3 = x2[1];
r3(), new r3();
var r5 = x2[1];
r5(), new r5();
 // error
