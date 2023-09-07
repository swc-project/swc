//// [ExportObjectLiteralAndObjectTypeLiteralWithAccessibleTypesInNestedMemberTypeAnnotations.ts]
var A, A1, UnitSquare;
import "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), UnitSquare = null, Object.defineProperty(A1, "UnitSquare", {
    enumerable: !0,
    get: function() {
        return UnitSquare;
    },
    set: function(v) {
        UnitSquare = v;
    }
});
