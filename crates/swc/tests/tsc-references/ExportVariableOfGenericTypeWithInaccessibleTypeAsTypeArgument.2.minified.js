//// [ExportVariableOfGenericTypeWithInaccessibleTypeAsTypeArgument.ts]
var A, A1, beez, beez2;
import "@swc/helpers/_/_class_call_check";
Object.defineProperty(A1 = A || (A = {}), "beez", {
    enumerable: !0,
    get: function() {
        return beez;
    },
    set: function(v) {
        beez = v;
    }
}), beez2 = [], Object.defineProperty(A1, "beez2", {
    enumerable: !0,
    get: function() {
        return beez2;
    },
    set: function(v) {
        beez2 = v;
    }
});
