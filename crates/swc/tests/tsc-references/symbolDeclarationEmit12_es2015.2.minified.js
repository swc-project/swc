var M;
!function(M) {
    class C {
        [Symbol.toPrimitive](x) {}
        [Symbol.isConcatSpreadable]() {}
        get [Symbol.toPrimitive]() {}
        set [Symbol.toPrimitive](x) {}
    }
    M.C = C;
}(M || (M = {}));
