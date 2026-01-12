//// [InvalidNonInstantiatedModule.ts]
(function(M) {})(M || (M = {}));
var m = M; // Error, not instantiated can not be used as var
var x; // Error only a namespace
var M;
