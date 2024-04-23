//// [ModuleWithExportedAndNonExportedVariables.ts]
var A;
(A || (A = {})).x = 'hello world', A.x, A.y;
