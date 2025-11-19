//// [assignmentCompatWithGenericCallSignatures2.ts]
// some complex cases of assignment compat of generic signatures. No contextual signature instantiation
var a;
var b;
// Both errors
a = b;
b = a;
