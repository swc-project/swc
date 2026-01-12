//// [TwoInternalModulesThatMergeEachWithExportedAndNonExportedInterfacesOfTheSameName.ts]
(function(A) {})(A || (A = {}));
(function(A) {})(A || (A = {}));
// ensure merges as expected
var p;
var p;
(function(X) {})(X || (X = {}));
// ensure merges as expected
var l;
var l;
var A, A, X;
