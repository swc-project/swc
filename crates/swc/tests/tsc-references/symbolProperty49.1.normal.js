//// [symbolProperty49.ts]
var M;
(function(M) {
    var Symbol;
    Object.defineProperty(M, "Symbol", {
        enumerable: true,
        get () {
            return Symbol;
        },
        set (v) {
            Symbol = v;
        }
    });
    class C {
        [Symbol.iterator]() {}
    }
})(M || (M = {}));
