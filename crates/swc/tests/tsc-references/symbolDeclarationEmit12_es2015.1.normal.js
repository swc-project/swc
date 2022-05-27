//@target: ES6
//@declaration: true
var M;
(function(M1) {
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
    M1.C = C;
})(M || (M = {}));
