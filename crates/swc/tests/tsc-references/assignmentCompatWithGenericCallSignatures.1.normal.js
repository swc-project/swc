//// [assignmentCompatWithGenericCallSignatures.ts]
// some complex cases of assignment compat of generic signatures that stress contextual signature instantiation
var f;
var g;
f = g; // ok
g = f; // ok
