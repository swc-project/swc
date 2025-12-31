//// [nestedModules.ts]
(function(A) {
    (function(B) {
        var Point = {
            x: 0,
            y: 0
        }; // bug 832088: could not find module 'C'
    })(A.B || (A.B = {}));
})(A || (A = {}));
var m = M2.X;
var point;
var point = m.Point;
var p;
var p;
var A;
