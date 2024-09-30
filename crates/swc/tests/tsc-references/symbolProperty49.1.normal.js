//// [symbolProperty49.ts]
(function(M) {
    class C {
        [M.Symbol.iterator]() {}
    }
})(M || (M = {}));
var M;
