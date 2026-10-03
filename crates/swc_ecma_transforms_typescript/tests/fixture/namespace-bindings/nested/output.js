(function(N) {
    (function(M) {
        M.x = 1;
    })(N.M || (N.M = {}));
})(N || (N = {}));
(function(N) {
    (function(M) {
        M.y = M.x + 1;
    })(N.M || (N.M = {}));
    const Inner = N.M;
    N.result = Inner.y;
})(N || (N = {}));
(function(N) {
    (function(M) {
        function get() {
            return M.y;
        }
        M.get = get;
    })(N.M || (N.M = {}));
})(N || (N = {}));
console.log(N.result, N.M.get());
var N;
