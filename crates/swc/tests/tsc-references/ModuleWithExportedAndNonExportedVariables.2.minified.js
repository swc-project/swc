//// [ModuleWithExportedAndNonExportedVariables.ts]
var A, A1;
A1 = A || (A = {}), A1.x = "hello world", A.x, A.y;
