//// [ExportVariableWithAccessibleTypeInTypeAnnotation.ts]
var A, A1, Origin;
A1 = A || (A = {}), Origin = {
    x: 0,
    y: 0
}, Object.defineProperty(A1, "Origin", {
    enumerable: !0,
    get: function() {
        return Origin;
    },
    set: function(v) {
        Origin = v;
    }
});
