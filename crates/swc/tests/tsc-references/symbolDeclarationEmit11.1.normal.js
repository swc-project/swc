//// [symbolDeclarationEmit11.ts]
let _Symbol_isConcatSpreadable = Symbol.isConcatSpreadable, _Symbol_toPrimitive = Symbol.toPrimitive, _Symbol_toPrimitive1 = Symbol.toPrimitive;
class C {
    static [_Symbol_isConcatSpreadable]() {}
    static get [_Symbol_toPrimitive]() {
        return "";
    }
    static set [_Symbol_toPrimitive1](x) {}
}
(()=>{
    C[Symbol.iterator] = 0;
})();
