//// [ExportVariableWithAccessibleTypeInTypeAnnotation.ts]
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
})(A || (A = {}));
