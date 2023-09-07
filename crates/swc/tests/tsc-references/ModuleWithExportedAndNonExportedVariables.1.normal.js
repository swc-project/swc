//// [ModuleWithExportedAndNonExportedVariables.ts]
var A;
(function(A) {
    var x = "hello world";
    Object.defineProperty(A, "x", {
        enumerable: true,
        get: function get() {
            return x;
        },
        set: function set(v) {
            x = v;
        }
    });
    var y = 12;
})(A || (A = {}));
var x;
var x = A.x;
// Error, since y is not exported
var y = A.y;
