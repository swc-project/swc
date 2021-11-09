//@target: ES6
//@declaration: true
var M1;
(function(M) {
    var tmp = Symbol.toPrimitive, tmp1 = Symbol.isConcatSpreadable, tmp2 = Symbol.toPrimitive, tmp3 = Symbol.toPrimitive;
    class C {
        [tmp](x) {
        }
        [tmp1]() {
            return undefined;
        }
        get [tmp2]() {
            return undefined;
        }
        set [tmp3](x1) {
        }
    }
    M.C = C;
})(M1 || (M1 = {
}));
