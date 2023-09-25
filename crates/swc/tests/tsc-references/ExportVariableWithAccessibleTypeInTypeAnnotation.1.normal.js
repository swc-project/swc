//// [ExportVariableWithAccessibleTypeInTypeAnnotation.ts]
var A;
(function(A) {
    // valid since Point is exported
    A.Origin = {
        x: 0,
        y: 0
    };
})(A || (A = {}));
