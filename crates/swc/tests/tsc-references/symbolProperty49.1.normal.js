//// [symbolProperty49.ts]
var M;
(function(M) {
    var Symbol = M.Symbol = void 0;
    class C {
        [Symbol.iterator]() {}
    }
})(M || (M = {}));
