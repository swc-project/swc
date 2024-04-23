//// [keyofInferenceIntersectsResults.ts]
var a = foo('a', 'b'); // compiles cleanly
var b = foo('a', 'b'); // also clean
var c = bar('a', 'b'); // still clean
