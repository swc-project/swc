// With no call signature | callSignatures
var x = (a)=>a.toString();
// With call signatures with different return type
var x2 = (a)=>a.toString(); // Like iWithCallSignatures
var x2 = (a)=>a; // Like iWithCallSignatures2
// With call signatures of mismatching parameter type
var x3 = (a)=>/*here a should be any*/ a.toString();
// With call signature count mismatch
var x4 = (a)=>/*here a should be any*/ a.toString();
