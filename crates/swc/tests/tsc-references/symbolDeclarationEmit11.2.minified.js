//// [symbolDeclarationEmit11.ts]
class C {
    static [Symbol.isConcatSpreadable]() {}
    static get [Symbol.toPrimitive]() {
        return "";
    }
    static set [Symbol.toPrimitive](x) {}
}
C[Symbol.iterator] = 0;
