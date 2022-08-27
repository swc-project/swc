//// [symbolDeclarationEmit12.ts]
var M;
(function(M) {
    class C {
        [Symbol.toPrimitive](x) {}
        [Symbol.isConcatSpreadable]() {
            return undefined;
        }
        get [Symbol.toPrimitive]() {
            return undefined;
        }
        set [Symbol.toPrimitive](x) {}
    }
    M.C = C;
})(M || (M = {}));
