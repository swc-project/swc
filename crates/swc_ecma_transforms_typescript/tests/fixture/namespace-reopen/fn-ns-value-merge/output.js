(function(N) {
    N.x = N.foo;
})(N || (N = {}));
(function(N) {
    function foo() {
        return 1;
    }
    N.foo = foo;
})(N || (N = {}));
(function(M) {
    M.before = M.B;
})(M || (M = {}));
(function(M) {
    (function(B) {
        B.c = 1;
    })(M.B || (M.B = {}));
})(M || (M = {}));
var N, M;
