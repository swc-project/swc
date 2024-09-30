//// [symbolDeclarationEmit12.ts]
let prop;
(function(M) {
    let _Symbol_toPrimitive = Symbol.toPrimitive, _Symbol_isConcatSpreadable = Symbol.isConcatSpreadable, _Symbol_toPrimitive1 = Symbol.toPrimitive, _Symbol_toPrimitive2 = Symbol.toPrimitive;
    class C {
        [_Symbol_toPrimitive](x) {}
        [_Symbol_isConcatSpreadable]() {
            return undefined;
        }
        get [_Symbol_toPrimitive1]() {
            return undefined;
        }
        set [_Symbol_toPrimitive2](x) {}
    }
    prop = Symbol.iterator;
    M.C = C;
})(M || (M = {}));
var M;
