//// [ModuleWithExportedAndNonExportedVariables.ts]
var A, A1, x;
A1 = A || (A = {}), x = "hello world", Object.defineProperty(A1, "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
}), A.x, A.y;
