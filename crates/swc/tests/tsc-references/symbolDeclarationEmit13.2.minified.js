//// [symbolDeclarationEmit13.ts]
class C {
    get [Symbol.toPrimitive]() {
        return "";
    }
    set [Symbol.toStringTag](x) {}
}
