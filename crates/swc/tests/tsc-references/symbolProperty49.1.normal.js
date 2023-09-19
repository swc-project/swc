//// [symbolProperty49.ts]
var M;
(function(M) {
    class C {
        [M.Symbol.iterator]() {}
    }
})(M || (M = {}));
