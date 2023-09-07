//// [symbolProperty49.ts]
var M, Symbol;
Object.defineProperty(M || (M = {}), "Symbol", {
    enumerable: !0,
    get: ()=>Symbol,
    set (v) {
        Symbol = v;
    }
}), Symbol.iterator;
