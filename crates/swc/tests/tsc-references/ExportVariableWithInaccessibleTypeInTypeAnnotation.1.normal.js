//// [ExportVariableWithInaccessibleTypeInTypeAnnotation.ts]
var A;
(function(A) {
    var Origin = {
        x: 0,
        y: 0
    };
    // valid since Point is exported
    Object.defineProperty(A, "Origin", {
        enumerable: true,
        get: function get() {
            return Origin;
        },
        set: function set(v) {
            Origin = v;
        }
    });
    var Origin3d = {
        x: 0,
        y: 0,
        z: 0
    };
    // invalid Point3d is not exported
    Object.defineProperty(A, "Origin3d", {
        enumerable: true,
        get: function get() {
            return Origin3d;
        },
        set: function set(v) {
            Origin3d = v;
        }
    });
})(A || (A = {}));
