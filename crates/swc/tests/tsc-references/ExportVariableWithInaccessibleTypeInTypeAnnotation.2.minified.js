//// [ExportVariableWithInaccessibleTypeInTypeAnnotation.ts]
var A, A1;
A1 = A || (A = {}), A1.Origin = {
    x: 0,
    y: 0
}, A1.Origin3d = {
    x: 0,
    y: 0,
    z: 0
};
