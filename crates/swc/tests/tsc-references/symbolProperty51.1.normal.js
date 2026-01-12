//// [symbolProperty51.ts]
(function(M) {
    (function(Symbol) {})(Symbol || (Symbol = {}));
    var Symbol;
    class C {
        [Symbol.iterator]() {}
    }
})(M || (M = {}));
var M;
