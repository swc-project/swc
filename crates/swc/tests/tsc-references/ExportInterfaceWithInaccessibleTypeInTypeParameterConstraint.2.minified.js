//// [ExportInterfaceWithInaccessibleTypeInTypeParameterConstraint.ts]
var A, A1, Origin, Origin3d;
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
}), Origin3d = {
    x: 0,
    y: 0,
    z: 0
}, Object.defineProperty(A1, "Origin3d", {
    enumerable: !0,
    get: function() {
        return Origin3d;
    },
    set: function(v) {
        Origin3d = v;
    }
});
