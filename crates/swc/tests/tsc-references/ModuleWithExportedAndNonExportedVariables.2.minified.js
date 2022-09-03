//// [ModuleWithExportedAndNonExportedVariables.ts]
(A || (A = {})).x = "hello world";
var A, x, x = A.x, y = A.y;
