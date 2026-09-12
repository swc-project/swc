(function(A) {
    (function(B) {
        const t = 1;
        B.x = t;
        B.y = B.x;
    })(A.B || (A.B = {}));
})(A || (A = {}));
var A;
