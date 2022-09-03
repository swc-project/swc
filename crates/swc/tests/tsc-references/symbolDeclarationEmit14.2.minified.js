//// [symbolDeclarationEmit14.ts]
class C {
    get [Symbol.toPrimitive]() {
        return "";
    }
    get [Symbol.toStringTag]() {
        return "";
    }
}
