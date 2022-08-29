//// [asOperatorAmbiguity.ts]
// Make sure this is a type assertion to an array type, and not nested comparison operators.
var x;
var y = x;
var z = y[0].m; // z should be string
