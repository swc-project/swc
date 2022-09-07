//// [symbolDeclarationEmit11.ts]
let _isConcatSpreadable = Symbol.isConcatSpreadable, _toPrimitive = Symbol.toPrimitive, _toPrimitive1 = Symbol.toPrimitive;
(class {
    static [_isConcatSpreadable]() {}
    static get [_toPrimitive]() {
        return "";
    }
    static set [_toPrimitive1](x) {}
})[Symbol.iterator] = 0;
