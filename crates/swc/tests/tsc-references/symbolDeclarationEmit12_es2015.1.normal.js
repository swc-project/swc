//@target: ES6
//@declaration: true
var M;
(function(M1) {
    var _key;
    let _toPrimitive = Symbol.toPrimitive, _isConcatSpreadable = Symbol.isConcatSpreadable, _toPrimitive1 = Symbol.toPrimitive, _toPrimitive2 = Symbol.toPrimitive;
    class C {
        [_toPrimitive](x) {}
        [_isConcatSpreadable]() {
            return undefined;
        }
        get [_toPrimitive1]() {
            return undefined;
        }
        set [_toPrimitive2](x) {}
    }
    M1.C = C;
    _key = Symbol.iterator;
})(M || (M = {}));
