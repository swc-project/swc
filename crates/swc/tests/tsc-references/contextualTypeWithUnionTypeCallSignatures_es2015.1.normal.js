//When used as a contextual type, a union type U has those members that are present in any of 
// its constituent types, with types that are unions of the respective members in the constituent types. 
// Let S be the set of types in U that have call signatures.
// If S is not empty and the sets of call signatures of the types in S are identical ignoring return types,
// U has the same set of call signatures, but with return types that are unions of the return types of the respective call signatures from each type in S.
// With no call signature | callSignatures
var x = (a)=>a.toString();
// With call signatures with different return type
var x2 = (a)=>a.toString(); // Like iWithCallSignatures
var x2 = (a)=>a; // Like iWithCallSignatures2
// With call signatures of mismatching parameter type
var x3 = (a)=>/*here a should be any*/ a.toString();
// With call signature count mismatch
var x4 = (a)=>/*here a should be any*/ a.toString();
