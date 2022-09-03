//// [symbolDeclarationEmit4.ts]
class C {
    get [Symbol.toPrimitive]() {
        return "";
    }
    set [Symbol.toPrimitive](x) {}
}
